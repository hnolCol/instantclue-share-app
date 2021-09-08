import os
from flask import json, request
from flask_restful import Resource
from ..utils.decrypt import decrypt

class AppValidator(Resource):
    def __init__(self,**kwargs):
        ""
        self.instancePath = kwargs["path"]
        self.IDManager = kwargs["id-manager"]
    
    def get(self):
        "Returns if an app is validated"
        return True
       

    def post(self):
        ""
        if "app-id" in request.json:
            appID = request.json["app-id"]
            if appID is None:
                return "No app-id found."
            verificationCode = request.json["verification"]
            decyrptedAppID = decrypt(self.instancePath,appID).decode("utf-8")
            
            print(self.IDManager.verify(decyrptedAppID,verificationCode))
          

    def put(self):
        "Intitate a new app ID. Requires email authentification."
        if "app-id" in request.json and "email" in request.json:
            appID = request.json["app-id"]
            email = request.json["email"]
            decyrptedAppID = decrypt(self.instancePath,appID).decode("utf-8")
            decyrptedEmail = decrypt(self.instancePath,email).decode("utf-8")
            self.IDManager.addID(decyrptedAppID,decyrptedEmail)
           
       
       

class CollisionChecker(Resource):
    def __init__(self,**kwargs):
        ""
        self.instancePath = kwargs["path"]
        self.IDManager = kwargs["id-manager"]

    def get(self):
        "Returns if an app is validated"
        appID = request.args.get("app-id")
        decyrptedByteAppID = decrypt(self.instancePath,appID)
        decryptedAppID = decyrptedByteAppID.decode("utf-8")
        return json.dumps({"valid":str(self.IDManager.checkCollision(decryptedAppID))})