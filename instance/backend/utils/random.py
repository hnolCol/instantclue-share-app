import random
import string

def getRandomString(N = 20):
    ""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=N))
