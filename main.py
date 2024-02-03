import ifcopenshell.geom
import ifcopenshell.util.shape
from specklepy.api import operations
from specklepy.api.wrapper import StreamWrapper
from specklepy.objects import Base
from objects.wall import Speckle2Wall
from specklepy.objects.geometry import Mesh

target_url = 'https://speckle.xyz/streams/cb3735a1c9/branches/test'
token = '902d92398804e5f0afe1f1c92ea89e8a48797d4ffa'

model = ifcopenshell.open('response.ifc')
settings = ifcopenshell.geom.settings()
settings.set(settings.USE_WORLD_COORDS, True)

speckle_walls = []
for wall in model.by_type('IfcWall')[:5]:

    # pset = wall.get_info()
    pset = ifcopenshell.util.element.get_psets(wall)

    shape = ifcopenshell.geom.create_shape(settings, wall)

    # matrix = ifcopenshell.util.shape.get_shape_matrix(wall)

    mesh = Mesh()
    mesh.vertices = list(shape.geometry.verts)
    mesh.faces = list(shape.geometry.faces)


    speckle_wall = Speckle2Wall()
    speckle_wall.name = wall.Name

    speckle_wall.displayMesh = mesh

    speckle_walls.append(speckle_wall)

obj = Base()

obj['walls'] = speckle_walls


# obj = ifc_to_speckle(model)

sw = StreamWrapper(target_url)
client = sw.get_client(token=token)
transport = sw.get_transport(token=token)

hash = operations.send(base=obj, transports=[transport])

client.commit.create(stream_id=transport.stream_id, object_id=hash, branch_name='test')

exit()