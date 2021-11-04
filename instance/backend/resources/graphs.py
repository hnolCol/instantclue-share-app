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
        graphID = request.args.get("graphID")
        protectedGraph = self.graphData.isGraphProtected(graphID)
        if protectedGraph is not None:
            return {"protected":"true" if protectedGraph else "false"}
        else:
            return {"error":"Graph not found"}

    def post(self):
        ""
        
        encryptedPWD = request.json["pwd"]
        graphID = request.json["graphID"]
        decryptedPWD = decrypt(self.instancePath,encryptedPWD).decode("utf-8")
        
        self.graphData.checkPassword(graphID,decryptedPWD)
    
class AppSpecificGraph(Resource):
    
    def __init__(self,**kwargs):

        self.instancePath = kwargs["path"]
        self.IDManager = kwargs["id-manager"]
        self.graphData = kwargs["graph-data"]

    def get(self):
        ""
        appID = request.args.get("appID")
        
        if appID is not None:
            graphs = self.graphData.getGraphsByAppID(appID)
            return graphs 

    def post(self):
        ""
        #return "Beatuiful post"
        
        #reutnr request.json
        if request.json is not None:
            appID = request.json["app-id"]
            # print(appID)
            # print("BUM")
            # decyrptedAppID = decrypt(self.instancePath,appID).decode("utf-8")
            graphs = self.graphData.getGraphsByAppID(appID)
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
        shortURL = request.args.get("graphID")
        #print(shortURL)
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
            "msg" : "GraphID does not exist or is missing."
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
        shortURL = request.args.get("graphID")
        
        self.graphData.updateData()
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
        shortURL = request.json["graphID"]
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
        "Add a new graph"
        if "appID" in request.json and "graph-props" in request.json:
            appID = request.json["appID"]
            
            if self.IDManager.isVerified(appID):
                data = request.json["data"]
                graphProps = request.json["graph-props"]
                searchData = request.json["search-data"]
                graphID = self.graphData.addGraph(appID,data,graphProps,searchData)
                return graphID
                
            else:
                return "Invalid appID. AppID not validated."
        else:
            return "Invalid json params."