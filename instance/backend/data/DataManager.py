

import pandas as pd
import numpy as np 

from ..utils.random import getRandomString

import os
from datetime import date 
from ..utils.random import getRandomString



class AppDataManager(object):
    ""

    def __init__(self, instancePath):
        ""
        self.instancePath = instancePath
        self.appSpecPath = os.path.join("data","app-specific")

    def addData(self):
        ""
        
        
