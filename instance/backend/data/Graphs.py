from datetime import datetime, date, timedelta
import os 
import pandas as pd
import numpy as np 
import json 
import zlib
from ..utils.random import getRandomString
from ..utils.decrypt import decrypt

DATA_COLUMNS = ["appID","graphID","protected","pwd","title","subtitle","DOI","contact"]

deltaTimeKwargs = {"90 days": {"days":90},
            "30 days": {"days":30},
            "24h":{"hours":24},
            "unlimited (publication)":"unlimited"
            }


class GraphDataHandler(object):
    ""

    def __init__(self,instancePath,bcryt,IDManager):
        ""
        self.instancePath = instancePath
        self.IDManger = IDManager
        self.bcryt = bcryt
        if not os.path.exists(self._getPathToDB()):
            pd.DataFrame(columns=DATA_COLUMNS).to_csv(self._getPathToDB(),index=None)

    def _createShortUrl(self,s):
        ""
        return str(zlib.crc32(s))

    def _getPathToDB(self):
        ""
        return os.path.join(self.instancePath,"data","graphs","graphs.txt")

    def _getPathToApp(self,appID):
        ""
        return os.path.join(self.instancePath,"data","app-specific",appID)

    def _getGraphID(self):
        ""
        return getRandomString(6)

    def _saveData(self, pathToFile, data):
        ""
        with open(pathToFile,"w") as f:
            json.dump(data,f)
    
    def _saveProps(self,pathToProps,props):
        ""

    def _addShareCounter(self,appID):
        ""
        self.IDManger.addShareCount(appID)

    def _getValidTime(self,validFor):
        ""
        
        if validFor in deltaTimeKwargs:
            kw = deltaTimeKwargs[validFor]
           
            if isinstance(kw,str):
                return kw
            validTill = date.today() + timedelta(**kw)
            
            return validTill

    def addGraphIDtoDB(self,appID,graphID,protected,pwHash,title,subtitle,info,DOI,validFor,contact):
        ""
       
        self.DB = self.getDB()
        self.DB = self.DB.append({
                    "appID":appID,
                    "graphID":graphID,
                    "protected":protected,
                    "validTill" : self._getValidTime(validFor),
                    "pwd":pwHash,
                    "title":title,
                    "subtitle":subtitle,
                    "DOI":DOI,
                    "info":info,
                    "contact":contact}, 
                                ignore_index=True)
        self._addShareCounter(appID)
        self.setDB()
        

    def addGraph(self,appID,data,graphProps,searchData):
        ""
        graphID = self._getGraphID()
        pathToApp, pathToGraph , pathToGraphData, pathToProps, pathToSearchData = self.getPaths(appID,graphID)
        #create dir 
        
        os.mkdir(pathToGraph)
        self._saveData(pathToGraphData,data)
        self._saveData(pathToProps,graphProps)
        self._saveData(pathToSearchData,searchData)
        
        protected = graphProps["pwd"]!="" if "pwd" in graphProps else False
        if protected:
            pwHash = self.bcryt.generate_password_hash(decrypt(self.instancePath,graphProps["pwd"])).decode("utf-8")
        else:
            pwHash = None
        self.addGraphIDtoDB(appID,graphID,protected,pwHash,graphProps["title"],graphProps["subtitle"],graphProps["info"],graphProps["DOI"],graphProps["valid"],graphProps["contact"])
        return graphID

    def isGraphProtected(self,graphID):
        ""
        graphData = self.getDBEntryByGraphID(graphID)
        if graphData is not None:
            
            return graphData.loc[:,"protected"].values[0]
        
    def checkPassword(self,graphID,pwd="asd"):
        ""
        graphData = self.getDBEntryByGraphID(graphID)
        
        if graphData is not None:
            pwdHash = graphData.loc[:,"pwd"].values[0].encode("utf-8")
            return self.bcryt.check_password_hash(pwdHash,pwd)
            
        return False


    def getDBEntryByGraphID(self,graphID):
        ""
        
        if not hasattr(self,"DB"):
            self.getDB()

        boolIdx = self.DB["graphID"] == graphID
        if np.any(boolIdx):
            return self.DB.loc[boolIdx,]

    def getDB(self):
        ""
        if hasattr(self,"DB"):
            pass
        elif not os.path.exists(self._getPathToDB()):
            pd.DataFrame(columns=DATA_COLUMNS).to_csv(self._getPathToDB(),index=None)
            self.readDB()
        else:
            self.readDB()
        return self.DB

    def getOpenAcessData(self,*args,**kwargs):
        ""
        DB = self.getDB() 
        
        return DB.loc[~DB["protected"],:].to_json(orient="records")

    def getOpenAcessDataShape(self,*args,**kwargs):
        ""
        DB = self.getDB() 
        return DB.loc[~DB["protected"],:].shape

    
    def readDB(self):
        ""
        self.DB = pd.read_csv(self._getPathToDB(),index_col=None)
        self.DB["graphID"] = self.DB["graphID"].astype(str) #if a rare case exisit an only numers occured - they might be read as integers
        self.DB["protected"] = self.DB["protected"].astype(bool) 
    def setDB(self):
        ""
        if hasattr(self,"DB"):
            self.DB.to_csv(self._getPathToDB(),index=None)

    def urlExists(self, graphID):
        ""
        DB = self.getDB()
        boolIdx = DB["graphID"].astype(str) == graphID

        return np.any(boolIdx)

    def updateData(self):
        ""
        self.readDB()


    def getPaths(self,appID,graphID):
        ""
        pathToApp = self._getPathToApp(appID)
        pathToGraph = os.path.join(pathToApp,graphID)
        pathToData = os.path.join(pathToGraph,"data.json")
        pathToProps = os.path.join(pathToGraph,"props.json")
        pathToSearchData = os.path.join(pathToGraph,"search.json")

        return pathToApp,pathToGraph,pathToData, pathToProps, pathToSearchData

    def getDataByURL(self,graphID):
        ""
        searchData, props, data = [], [], []
        DB = self.getDB()
        graphExists, boolIdx = self.graphIDExists(graphID)
        #boolIdx = DB["graphID"].values == graphID
        if graphExists:
            graphID = DB.loc[boolIdx,"graphID"].values[0]
            appID = DB.loc[boolIdx,"appID"].values[0]
            pathToApp, pathToGraph , pathToGraphData, pathToProps, pathToSearchData = self.getPaths(appID,graphID)

            if os.path.exists(pathToGraphData):
                with open(pathToGraphData,"r") as f:
                    data = json.load(f)
                if os.path.exists(pathToProps):
                    with open(pathToProps,"r") as f:
                        props = json.load(f)
                        del props["pwd"]
                else:
                    props = None
                if os.path.exists(pathToSearchData):
                    with open(pathToSearchData,"r") as f:
                        searchData = json.load(f)
                else:
                    searchData = None
                return data, props, searchData
        return None, None, None

    def graphIDExists(self,graphID):
        ""
        DB = self.getDB()
        boolIdx = DB["graphID"].values == graphID
        return np.any(boolIdx),boolIdx
            
    def getGraphsByAppID(self,appID):
        ""
        DB = self.getDB()
        idx = DB["app-id"] == appID
        columnNames = [colName for colName in DB.columns if colName != "pwd"]
        if np.any(idx.values):
            return DB[columnNames].loc[idx].to_json()
        return pd.DataFrame(columns=columnNames).to_json()

        




