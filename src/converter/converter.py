import json
import ast
import tqdm
from pathlib import Path

import ifcopenshell.geom
import ifcopenshell.util.shape

from specklepy.api import operations
from specklepy.api.wrapper import StreamWrapper
from specklepy.objects import Base
from specklepy.objects.geometry import Mesh

# Add to path
import sys
import os
sys.path.append(str(Path(os.getcwd()).parent))

from src.objects import *

from src.mapping import *

import pandas as pd


class IfcConverter:

    TYPES = {
        'IfcWall': Speckle2Wall,
        'IfcSlab': Speckle2Floor,
        'IfcSpace': Speckle2Space,
        # 'IfcBeam': Speckle2Beam,
        # 'IfcColumn': Speckle2Column,
        'IfcBuildingElementProxy': Speckle2Wall
    }

    def __init__(self):
        self.model = None
        self.settings = ifcopenshell.geom.settings()
        self.settings.set(self.settings.USE_WORLD_COORDS, True)
        self.speckle_project = None

    def open_ifc(self, file):
        self.model = ifcopenshell.open(file)

    def convert_to_speckle(self):

        def flatten_dict(d, parent_key='', sep='_'):
            items = []
            for k, v in d.items():
                new_key = f"{parent_key}{sep}{k}" if parent_key else k
                if isinstance(v, dict):
                    items.extend(flatten_dict(v, new_key, sep=sep).items())
                else:
                    items.append((new_key, v))
            return dict(items)

        base = Base()
        # base.add_chunkable_attrs(walls=100)

        KeyMapper = Mapper("mapping_X2Y.json")
        materials = set()

        for _type, _class in self.TYPES.items():

            speckle_objs = []
            for elem in tqdm.tqdm(self.model.by_type(_type), f'Converting {_type}...'):
            # for elem in tqdm.tqdm(self.model.by_type(_type)[:5], f'Converting {_type}...'):

                speckle_obj = _class()
                speckle_obj.name = elem.Name

                try:
                    shape = ifcopenshell.geom.create_shape(self.settings, elem)

                    new_faces = []
                    for face in ifcopenshell.util.shape.get_faces(shape.geometry):
                        new_faces.extend([0] + list(face))

                    mesh = Mesh.create(vertices=list(shape.geometry.verts), faces=new_faces)

                    speckle_obj.displayMesh = mesh
                except:
                    pass

                pset = ifcopenshell.util.element.get_psets(elem)

                flat_pset = flatten_dict(pset)
                parameters = Base()
                speckle_obj.parameters = parameters
                for sourceKey, value in flat_pset.items():
                    # convert source key to target key using the config mapper
                    key = KeyMapper.ConvertAttributeKey(sourceKey)
                    if hasattr(speckle_obj, key):
                        setattr(speckle_obj, key, value)
                    else:
                        setattr(speckle_obj.parameters, key, value)

                speckle_objs.append(speckle_obj)

            type_name = ('@' + _type[3:] + 's').lower()
            base[type_name] = speckle_objs

        self.speckle_project = base

    def compute_lca(self):

        df = pd.read_excel(Path(__file__).parent.parent / 'data' / 'lca-dataset 1.xlsx')

        # Compose json config path
        json_file = Path(__file__).parent.parent / 'mapping' / 'mapping_config' / 'mapping_IFC_LCA1.json'

        # Read json content
        with open(json_file) as json_data:
            material_mapping = json.load(json_data)

        for _type, _class in self.TYPES.items():
            for elem in getattr(self.speckle_project, '@' + _type[3:].lower() + 's', []):

                for material in material_mapping.keys():
                    if material in elem.name.lower():
                        lca_data = df[df['Resources.Name'] == material_mapping[material]]
                        lca_data = lca_data.iloc[0]
                        density = lca_data['Resources.Conversions.Value']
                        if isinstance(density, str):
                            density = float(ast.literal_eval(density.replace(',', '.')))
                        gwp_per_kg = lca_data['Resources.DataItems.DataValueItems.Value']
                        if isinstance(gwp_per_kg, str):
                            gwp_per_kg = float(ast.literal_eval(gwp_per_kg.replace(',', '.')))

                        if elem.volume:
                            gwp = elem.volume * density * gwp_per_kg
                            elem.density = density
                            elem.gwp_per_kg = gwp_per_kg
                            elem.gwp = gwp
                    elif material in getattr(elem, 'family', ''):
                        lca_data = df[df['Resources.Name'] == material_mapping[material]]
                        lca_data = lca_data.iloc[0]
                        density = lca_data['Resources.Conversions.Value']
                        if isinstance(density, str):
                            density = float(ast.literal_eval(density.replace(',', '.')))
                        gwp_per_kg = lca_data['Resources.DataItems.DataValueItems.Value']
                        if isinstance(gwp_per_kg, str):
                            gwp_per_kg = float(ast.literal_eval(gwp_per_kg.replace(',', '.')))

                        if elem.volume:
                            gwp = elem.volume * density * gwp_per_kg
                            elem.density = density
                            elem.gwp_per_kg = gwp_per_kg
                            elem.gwp = gwp

    def send_to_speckle(self, token, stream_url, project_name):

        sw = StreamWrapper(stream_url)
        client = sw.get_client(token=token)
        transport = sw.get_transport(token=token)

        hash_obj = operations.send(base=self.speckle_project, transports=[transport])

        client.branch.create(sw.stream_id, project_name)

        commit_id = client.commit.create(stream_id=transport.stream_id, object_id=hash_obj, branch_name=project_name)

        return hash_obj, f'https://speckle.xyz/streams/{transport.stream_id}/commits/{commit_id}'

