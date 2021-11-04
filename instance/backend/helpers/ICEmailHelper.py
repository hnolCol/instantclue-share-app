
from flask_mail import Message, Mail

from threading import Thread
import time
class ICAppEmailHelper(object):

    def __init__(self,app):

        self.app = app
        self.mail = Mail(app)

    def send_async_email(self,msg):
        with self.app.app_context():
            self.mail.send(msg)

    def sendEmail(self,title = "MitoCube - Support", body = "Welcome to MitoCube",recipients = ["h.nolte@age.mpg.de"], bodyIsHTML = False):
        with self.app.app_context():
            msg = Message(title, recipients = recipients)
            if bodyIsHTML:
                msg.html = body
            else:
                msg.body = body
        # self.mail.send(msg)
            thr = Thread(target=self.send_async_email,args=[msg])
            thr.start()
            return True
