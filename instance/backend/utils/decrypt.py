
from Cryptodome.PublicKey import RSA
from Cryptodome.Cipher import PKCS1_OAEP
import os
import base64

def decrypt(appPath,encryptedString):
    "Decrypt string based on a private key. Used to communicate with standalone apps."
    encString = base64.b64decode(encryptedString)
    privateKeyPath = os.path.join(appPath,"static","private.pem")
    privateKey = RSA.import_key(open(privateKeyPath).read())
    decryptor = PKCS1_OAEP.new(privateKey)
    decrypted = decryptor.decrypt(encString)
    return decrypted

