import os
from pathlib import Path
import json




class Mapper():

    def __init__(self, configFileName):
        self.ConfigFileName = configFileName
        self.MappingDictionary = self.LoadMappingDictionary()


    def LoadMappingDictionary(self):
        # Find the directory of the current file
        dir_path = Path(os.path.dirname(os.path.realpath(__file__)))

        # Compose json config path
        json_file = "%s\mapping_config\%s"%(dir_path.__str__(), self.ConfigFileName)

        # Read json content 
        with open(json_file) as json_data:
             return json.load(json_data)
    
    def ConvertAttributeKey(self, sourceKey):
        """try to convert the input key using the loaded mapping dictionnary.
        Returns the targetKey if source is found in the config. Returns the original key otherwise.
        """
        targetKey = self.MappingDictionary.get(sourceKey, sourceKey)
        return targetKey

# print ("starting")
# mapper = Mapper("mapping_X2Y.json")