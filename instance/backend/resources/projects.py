import os
from flask import request
from flask_restful import Resource
import numpy as np 
import pandas as pd
import pickle

def save_obj(obj, name ):
    with open(name + '.pkl', 'wb') as f:
        pickle.dump(obj, f, pickle.HIGHEST_PROTOCOL)

def load_obj(name ):
    with open(name + '.pkl', 'rb') as f:
        return pickle.load(f)

class Projects(Resource):
    def __init__(self,**kwargs):

        self.instancePath = kwargs["path"]

    def get(self):
        ""
        print(self.instancePath)
        return [{"name":"Oma1","ID":123}]

    def post(self):
        "Add project."
       
        data = request.json
        return {"success":True}

    def delete(self):
        "Deletes project entries"


class ProjectEntries(Resource):
    def __init__(self,**kwargs):

        self.instancePath = kwargs["path"]

    def get(self):
        "Returns entries of a project"
       
        d = {'ID': 123, 'title': 'Project entry', 'text':  "> A block *quote* with ~strikethrough~ and a URL: https://reactjs.org.", 
                    'isMarkDown': True, 'time': 1608642777.876534, 'timeFrmt': '12/22/2020, 14:12:57',"type":"text"}
        #d = load_obj("pp")
        X = pd.DataFrame(np.random.normal(loc=4, size=(2000,3)), columns=["x","y","s"])
       
        #return d
        return [v for v in X.to_dict(orient="index").values()]#d

    def post(self):
        "Add project."
        data = request.json
        print(data)
        print(data["ID"])
        print(data["text"])
        print(dict(data))
        d = dict(data)
        save_obj([d],"pp")
        return {"success":True}
