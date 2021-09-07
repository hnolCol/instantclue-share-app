import os 
import pandas as pd
import numpy as np 
import json 
import zlib
from ..utils.random import getRandomString
from ..utils.decrypt import decrypt

DATA_COLUMNS = ["app-id","graph-id","short-url","protected","pwd","title"]

class GraphDataHandler(object):
    ""

    def __init__(self,instancePath,bcryt):
        ""
        self.instancePath = instancePath
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
        return getRandomString(5)

    def _saveData(self, pathToFile, data):
        ""
        with open(pathToFile,"w") as f:
            json.dump(data,f)
    
    def _saveProps(self,pathToProps,props):
        ""

    def addGraphIDtoDB(self,appID,graphID,shortUrl,protected,pwHash,title):
        ""
       
        self.DB = self.getDB()
        self.DB = self.DB.append({
                    "app-id":appID,
                    "graph-id":graphID,
                    "short-url":shortUrl,
                    "protected":protected,
                    "pwd":pwHash,
                    "title":title}, 
                                ignore_index=True)
        self.setDB()
        

    def addGraph(self,appID,data,graphProps,searchData):
        ""
        graphID = self._getGraphID()
        combinedIDs = appID+graphID
        url = self._createShortUrl(combinedIDs.encode("utf-8"))
        pathToApp, pathToGraph , pathToGraphData, pathToProps, pathToSearchData = self.getPaths(appID,graphID)
        #create dir 
        print(graphProps)
        os.mkdir(pathToGraph)
        self._saveData(pathToGraphData,data)
        self._saveData(pathToProps,graphProps)
        self._saveData(pathToSearchData,searchData)

        protected = graphProps["pwd"]!=""
        if protected:
            pwHash = self.bcryt.generate_password_hash(decrypt(self.instancePath,graphProps["pwd"])).decode("utf-8")
        else:
            pwHash = None
        self.addGraphIDtoDB(appID,graphID,url,graphProps["pwd"]!="",pwHash,graphProps["title"])
        return url

    def isGraphProtected(self,url):
        ""
        graphData = self.getDBEntryByURL(url)
        if graphData is not None:
            
            return graphData.loc[:,"protected"].values[0]
        
    def checkPassword(self,url,pwd="asd"):
        ""
        graphData = self.getDBEntryByURL(url)
        
        if graphData is not None:
            pwdHash = graphData.loc[:,"pwd"].values[0].encode("utf-8")
            return self.bcryt.check_password_hash(pwdHash,pwd)
            
        return False


    def getDBEntryByURL(self,url):
        ""
        
        if not hasattr(self,"DB"):
            self.getDB()

        boolIdx = self.DB["short-url"] == url
        if np.any(boolIdx):
            return self.DB.loc[boolIdx,]

    def getDB(self):
        ""
        if hasattr(self,"DB"):
            pass
        elif not os.path.exists(self._getPathToDB()):
            pd.DataFrame(columns=DATA_COLUMNS).to_csv(self._getPathToDB(),index=None)
        else:
            self.DB = pd.read_csv(self._getPathToDB(),index_col=None)
            self.DB["short-url"] = self.DB["short-url"].astype(str)
        return self.DB

    def setDB(self):
        if hasattr(self,"DB"):
            self.DB.to_csv(self._getPathToDB(),index=None)

    def urlExists(self, shortURL):
        ""
        DB = self.getDB()
        boolIdx = DB["short-url"].astype(str) == shortURL

        return np.any(boolIdx)

    def getPaths(self,appID,graphID):
        ""
        pathToApp = self._getPathToApp(appID)
        pathToGraph = os.path.join(pathToApp,graphID)
        pathToData = os.path.join(pathToGraph,"data.json")
        pathToProps = os.path.join(pathToGraph,"props.json")
        pathToSearchData = os.path.join(pathToGraph,"search.json")

        return pathToApp,pathToGraph,pathToData, pathToProps, pathToSearchData

    def getDataByURL(self,url):
        ""
        searchData, props, data = [], [], []
        DB = self.getDB()
        boolIdx = DB["short-url"].values == url 
        
        graphID = DB.loc[boolIdx,"graph-id"].values[0]
        appID = DB.loc[boolIdx,"app-id"].values[0]
        pathToApp, pathToGraph , pathToGraphData, pathToProps, pathToSearchData = self.getPaths(appID,graphID)
        if os.path.exists(pathToGraphData):
            with open(pathToGraphData,"r") as f:
                data = json.load(f)
            if os.path.exists(pathToProps):
                with open(pathToProps,"r") as f:
                    props = json.load(f)
                    del props["pwd"]
            if os.path.exists(pathToSearchData):
                with open(pathToSearchData,"r") as f:
                    searchData = json.load(f)
            return data, props, searchData


            
    def getGraphsByAppID(self,decryptedAppID):
        ""
        DB = self.getDB()
        idx = DB["app-id"] == decryptedAppID
        if np.any(idx.values):
            return DB.loc[idx]
        return pd.DataFrame() 

        




