import os
import pandas as pd

# read the queue message and write to stdout
inputMessage = open(os.environ['triggerBlob'], "r").read()
print( inputMessage )
#message = "Python script processed queue message '{0}'".format(inputMessage)
#print(message)
#print( os.environ.keys() )