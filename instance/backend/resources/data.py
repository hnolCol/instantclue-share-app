import os
from flask import json, request, send_file, Response
from numpy import shares_memory, short
from flask_restful import Resource
import pandas as pd 
from ..utils.decrypt import decrypt

class DataHandler(Resource):
    def __init__(self,**kwargs):
        self.instancePath = kwargs["path"]
        self.graphData = kwargs["graph-data"]
        #self.IDManager = kwargs["id-manager"]


    def get(self):
        "Returns all open acess data acquired."
        return self.graphData.getOpenAcessData()

class DataDownloadHandler(Resource):
    def __init__(self,**kwargs):
        ""
        self.instancePath = kwargs["path"]
        self.graphData = kwargs["graph-data"]

    def get(self):
        "Returns plot data file"
        graphID = request.args.get("graphID")

        if graphID is None or not self.graphData.graphIDExists(graphID)[0]: #graphIDExists returns tuple
            return "graphID not given or it does not exist"
        data, props, searchData = self.graphData.getDataByURL(graphID)
        df = pd.read_json(data)
     
        return Response(
                df.to_csv(sep="\t"),
                mimetype="text/csv",
                headers={"Content-disposition":
                "attachment; filename=GraphData({}).txt".format(graphID)})
        return send_file(df.to_csv(sep="\t"),
                     mimetype='text/csv',
                     attachment_filename='GraphData({}).csv'.format(graphID),
                     as_attachment=True)

class DataSizeHandler(Resource):
    def __init__(self,**kwargs):
        self.instancePath = kwargs["path"]
        self.graphData = kwargs["graph-data"]
        #self.IDManager = kwargs["id-manager"]


    def get(self):
        "Returns all open acess data acquired."
        return self.graphData.getOpenAcessDataShape()[0]
