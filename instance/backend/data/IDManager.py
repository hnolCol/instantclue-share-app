import pandas as pd
import numpy as np 

from ..utils.random import getRandomString

import os
from datetime import date 

class AppIDManager(object):
    ""

    def __init__(self, instancePath):
        ""
        self.instancePath = instancePath
        self.fileIsModified = False
        self._createPathToDB()
        self._checkPath()
        self._loadData()

    def _checkPath(self):
        ""
        if not os.path.exists(self.pathToDB):
            data = pd.DataFrame(columns = ["id","validated","creationDate","numberShares"])
            data.to_csv(self.pathToDB,index=None)
            

    def _createPathToDB(self):
        ""
        self.pathToDB = os.path.join(self.instancePath,"data","ids","app.txt")


    def _loadData(self):
        ""
        self.data = pd.read_csv(self.pathToDB,index_col=None)

    def _saveData(self):
        ""
        if hasattr(self,"data"):
            self.data.to_csv(self.pathToDB,index=None)

    def addAppFolder(self,appID):
        ""
        pathToFolder = os.path.join(self.instancePath,"data","app-specific",appID)
        os.mkdir(pathToFolder)
    
    def addShareCount(self,appID):
        ""
        self._loadData() 
        boolIdx = self.data["id"] == appID
        if np.any(boolIdx):
            self.data.loc[boolIdx,"numberShares"] = self.data.loc[boolIdx,"numberShares"] + 1 
            self._saveData() 
        
    def addID(self, appID, email):
        ""
        if self.checkCollision(appID) and not self.fileIsModified:
            x = {
                "id":appID,
                "validated":False,
                "creationDate":date.today().strftime("%Y%M%D"),
                "numberShares":0,
                "verification": getRandomString(10)
                }
            self.data = self.data.append(x,ignore_index=True)
            return True
        return False

    def checkCollision(self,appID):
        ""
        return np.all(self.data["id"].values != appID)
    
    def verify(self,appID,verificationCode):
        ""
        idx = self.data["id"]  == appID
        if np.any(idx.values):
            if self.data.loc[idx,"verification"].values[0] == verificationCode:
                self.data.loc[idx,"validated"] = True
                self.data.to_csv(self.pathToDB,index=None)
                self.addAppFolder(appID)
                return {"msg":"App is verified."}
        else:
            return {"msg":"App id not found."}
    
    def isVerified(self,appID):
        ""
        self._loadData()
        idx = self.data["id"]  == appID
        if np.any(idx.values):
            return self.data.loc[idx,"validated"].values[0] == True
        else:

            return False
    
    def getDBIdxForAppID(self,appID):
        ""
        idx = self.data["id"]  == appID
        if np.any(idx.values):
            return True,idx

        else:

            return False, None

