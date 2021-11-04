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
        appID = request.args.get("appID")
        isValidated = self.IDManager.isVerified(appID=appID) #returns np.bool_ - transform to bool!
        
        return bool(isValidated)
        
       

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
            
            decyrptedEmail = decrypt(self.instancePath,email).decode("utf-8")
            success = self.IDManager.addID(appID,decyrptedEmail)
            print (success)
       
       

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