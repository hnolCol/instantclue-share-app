import os
from flask import json, request
from numpy import shares_memory, short
from flask_restful import Resource

from ..utils.decrypt import decrypt

class GraphProtection(Resource):
    def __init__(self,**kwargs):
        self.instancePath = kwargs["path"]
        self.graphData = kwargs["graph-data"]


    def get(self):
        ""
        shortURL = request.args.get("url")
        protectedGraph = self.graphData.isGraphProtected(shortURL)
        if protectedGraph is not None:
            protectedByPW = "true" if protectedGraph else "false"
            return {"protected":protectedByPW}
        else:
            return {"error":"Graph not found"}

    def post(self):
        ""
        
        encryptedPWD = request.json["pwd"]
        url = request.json["url"]
        decryptedPWD = decrypt(self.instancePath,encryptedPWD).decode("utf-8")
        print(decryptedPWD)
        self.graphData.checkPassword(url,decryptedPWD)
    
class AppSpecificGraph(Resource):
    
    def __init__(self,**kwargs):

        self.instancePath = kwargs["path"]
        self.IDManager = kwargs["id-manager"]
        self.graphData = kwargs["graph-data"]

    
    def post(self):
        ""
        print("going here")
        print(request.json)
        if request.json is not None:
            appID = request.json["app-id"]
            print(appID)
            print("BUM")
            decyrptedAppID = decrypt(self.instancePath,appID).decode("utf-8")
            graphs = self.graphData.getGraphsByAppID(decyrptedAppID)
            print(graphs)
            return graphs.to_json(orient="records")
        else:
            return "Not all required data found."
        
class GraphTextManager(Resource):
    def __init__(self,**kwargs):
        ""
        self.instancePath = kwargs["path"]
        self.IDManager = kwargs["id-manager"]
        self.graphData = kwargs["graph-data"]

    def get(self):
        ""
        shortURL = request.args.get("url")
        if self.graphData.urlExists(shortURL):
            if self.graphData.isGraphProtected(shortURL):
                return {"success":False,"msg":"Graph is protected by password. Please use post method. And add pwd param with encrypted pw."}
            _, plotProps, _ = self.graphData.getDataByURL(shortURL)
            
            return {
                "success" : True,
                "props" : plotProps, 
                }

        return {
            "success" : False,
            "msg" : "Url does not exist."
        }


    def post(self):
        ""
        shortURL = request.json["url"]
        pwd = request.json["pwd"]
        if self.graphData.urlExists(shortURL):
            if self.graphData.isGraphProtected(shortURL):
                if self.graphData.checkPassword(shortURL,pwd):
                    plotData, plotProps, searchData = self.graphData.getDataByURL(shortURL)
                    return {
                            "success" : True,
                            "props" : plotProps, 
                            }
        return {
                "success" : False,
                "msg" : "Either url does not exist or password incorrect."
                }


class GraphManager(Resource):
    def __init__(self,**kwargs):
        ""
        self.instancePath = kwargs["path"]
        self.IDManager = kwargs["id-manager"]
        self.graphData = kwargs["graph-data"]

    def get(self):
        ""
        shortURL = request.args.get("url")
        if self.graphData.urlExists(shortURL):
            if self.graphData.isGraphProtected(shortURL):
                return {"success":False,"msg":"Graph is protected by password. Please use post method. And add pwd param with encrypted pw."}
            plotData, plotProps, searchData = self.graphData.getDataByURL(shortURL)
            
            return {
                "success" : True,
                "plotData" : plotData,
                "props" : plotProps, 
                "searchData" : searchData
            }

        return {
            "success" : False,
            "msg" : "Url does not exist."
        }


    def post(self):
        ""
        shortURL = request.json["url"]
        pwd = request.json["pwd"]
        if self.graphData.urlExists(shortURL):
            if self.graphData.isGraphProtected(shortURL):
                if self.graphData.checkPassword(shortURL,pwd):
                    plotData, plotProps, searchData = self.graphData.getDataByURL(shortURL)
                    return {
                            "success" : True,
                            "plotData" : plotData,
                            "props" : plotProps, 
                            "searchData" : searchData
                            }
        return {
                "sucess" : False,
                "msg" : "Either url does not exist or password incorrect."
                }


    def put(self):
        if "app-id" in request.json and "graph-props" in request.json:
            appID = request.json["app-id"]
            decryptedAppID = decrypt(self.instancePath,appID).decode("utf-8")
            if self.IDManager.isVerified(decryptedAppID):
                data = request.json["data"]
                graphProps = request.json["graph-props"]
                searchData = request.json["search-data"]
                url = self.graphData.addGraph(decryptedAppID,data,graphProps,searchData)
                return url
                
            else:
                return "Invalid app id."
        else:
            return "Invalid json params."