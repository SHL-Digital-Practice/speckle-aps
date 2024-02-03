import tqdm

import ifcopenshell.geom
import ifcopenshell.util.shape

from specklepy.api import operations
from specklepy.api.wrapper import StreamWrapper
from specklepy.objects import Base
from specklepy.objects.geometry import Mesh

from src.objects import *


class IfcConverter:

    TYPES = {
        'IfcWall': Speckle2Wall,
        'IfcSlab': Speckle2Floor,
        'IfcSpace': Speckle2Space,
        # 'IfcBeam': Speckle2Beam,
        # 'IfcColumn': Speckle2Column,
    }

    def __init__(self):
        self.model = None
        self.settings = ifcopenshell.geom.settings()
        self.settings.set(self.settings.USE_WORLD_COORDS, True)

    def open_ifc(self, file):
        self.model = ifcopenshell.open(file)

    def to_speckle(self, token, target_url):

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

        for type, _class in self.TYPES.items():

            speckle_objs = []
            for elem in tqdm.tqdm(self.model.by_type(type), f'Converting {type}...'):

                shape = ifcopenshell.geom.create_shape(self.settings, elem)

                new_faces = []
                for face in ifcopenshell.util.shape.get_faces(shape.geometry):
                    new_faces.extend([0] + list(face))

                mesh = Mesh.create(vertices=list(shape.geometry.verts), faces=new_faces)

                speckle_obj = _class()
                speckle_obj.name = elem.Name
                speckle_obj.displayMesh = mesh

                pset = ifcopenshell.util.element.get_psets(elem)

                flat_pset = flatten_dict(pset)
                parameters = Base()
                speckle_obj.parameters = parameters
                for key, value in flat_pset.items():
                    if hasattr(speckle_obj, key):
                        setattr(speckle_obj, key, value)
                    else:
                        setattr(speckle_obj.parameters, key, value)

                speckle_objs.append(speckle_obj)

            type_name = (type[3:] + 's').lower()
            base[type_name] = speckle_objs

        sw = StreamWrapper(target_url)
        client = sw.get_client(token=token)
        transport = sw.get_transport(token=token)

        hash = operations.send(base=base, transports=[transport])

        client.commit.create(stream_id=transport.stream_id, object_id=hash, branch_name=sw.branch_name)

