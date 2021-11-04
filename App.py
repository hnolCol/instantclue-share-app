from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_restful import Resource, Api
from flask_mail import Mail, Message
from flask_bcrypt import Bcrypt
#external package imports
import pandas as pd
import os
import pickle
#internal imports
from instance.backend.resources.projects import Projects, ProjectEntries
from instance.backend.resources.validateApp import AppValidator, CollisionChecker
from instance.backend.resources.graphs import GraphManager, GraphProtection,  AppSpecificGraph, GraphTextManager
from instance.backend.resources.data import DataHandler, DataSizeHandler, DataDownloadHandler
from instance.backend.data.IDManager import AppIDManager
from instance.backend.data.DataManager import AppDataManager
from instance.backend.data.Graphs import GraphDataHandler
from instance.backend.helpers.ICEmailHelper import ICAppEmailHelper
# set the project root directory as the static folder
app = Flask(__name__,
            static_folder='build/static',
            template_folder="build",
            
            )

api = Api(app)
bcryt = Bcrypt(app)
#ID Manager
IDManager = AppIDManager(app.instance_path)
DataManager = AppDataManager(app.instance_path)
GraphData = GraphDataHandler(app.instance_path,bcryt,IDManager)
mail = Mail(app)
#load mail settings
app.config['MAIL_SERVER']= "mail.privateemail.com"
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = "verification@instantclue.de"#support@instantclue.de"
app.config['MAIL_DEFAULT_SENDER'] = "verification@instantclue.de"
app.config['MAIL_PASSWORD'] = "instantcluegoeswild"
app.config['MAIL_USE_TLS'] = False 
app.config['MAIL_USE_SSL'] = True

print(app.config)
                
mailer = ICAppEmailHelper(app)

mailer.mail.init_app(app)
# mailer.sendEmail(
#         title = "Verification: Instant Clue Web Application", 
#         body="<html><h1>Welcome to the Instant Clue Share Festival.</h1><p>Thank you for contacting the InstantClue app.</p><hp>The verification code is: <h3>asd</h3><p>and your App ID is<h3></h3><p>If you re-installer/upgrade Instant Clue you will have to enter the App ID and verify it again.</p></p></p><p>Best wishes and enjoy using the app. If you have questions/suggestions please contact us via  email support@instantclue.de</p><p>The Instant Clue Team</p></html>",
#         bodyIsHTML=True)

api.add_resource(Projects, '/api/v1/projects',
        resource_class_kwargs={'path': app.instance_path}) 

api.add_resource(ProjectEntries, '/api/v1/projects/entries',
        resource_class_kwargs={'path': app.instance_path}) 

api.add_resource(AppValidator,'/api/v1/app/validate',
        resource_class_kwargs={'path': app.instance_path,"id-manager":IDManager})

api.add_resource(CollisionChecker,'/api/v1/app/id/exists',
                resource_class_kwargs={'path': app.instance_path,"id-manager":IDManager})

api.add_resource(AppSpecificGraph,'/api/v1/app/graphs',
                resource_class_kwargs={'path': app.instance_path,"id-manager":IDManager,"graph-data":GraphData})

api.add_resource(GraphManager,'/api/v1/graph',
                resource_class_kwargs={'path': app.instance_path,"id-manager":IDManager,"graph-data":GraphData})

api.add_resource(GraphTextManager,'/api/v1/graph/text',
                resource_class_kwargs={'path': app.instance_path,"id-manager":IDManager,"graph-data":GraphData})

api.add_resource(DataHandler,'/api/v1/data',
                resource_class_kwargs={'path': app.instance_path,"graph-data":GraphData})

api.add_resource(DataDownloadHandler,'/api/v1/data/download',
                resource_class_kwargs={'path': app.instance_path,"graph-data":GraphData})

api.add_resource(DataSizeHandler,'/api/v1/data/size',
                resource_class_kwargs={'path': app.instance_path,"graph-data":GraphData})

api.add_resource(GraphProtection,'/api/v1/graph/protected',
                resource_class_kwargs={'path': app.instance_path,"graph-data":GraphData})



#api.add_resource(CollisionChecker,'/api/v1/graph',
 #               resource_class_kwargs={'path': app.instance_path,"id-manager":IDManager, "data-manager":DataManager})

@app.route("/")
def build_index():
    #return "<h1 style='color:blue'>Hello There!</h1>"
    return render_template("index.html")

  
@app.route('/api/v1/svgFiles/<svgFile>.svg')
def serve_content(svgFile):
        p = os.path.join(app.instance_path,"data","static","svg")
        return send_from_directory(p,svgFile+'.svg',mimetype = "image/svg+xml")


if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, host="0.0.0.0")
