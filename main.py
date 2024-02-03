from specklepy.api import operations
from specklepy.api.wrapper import StreamWrapper
from specklepy.objects import Base
from objects.wall import Speckle2Wall

target_url = 'https://speckle.xyz/streams/cb3735a1c9/branches/test'
token = '902d92398804e5f0afe1f1c92ea89e8a48797d4ffa'


obj = Base()

obj['walls'] = [
    Speckle2Wall()
]

# obj = ifc_to_speckle(ifc_obj)

sw = StreamWrapper(target_url)
client = sw.get_client(token=token)
transport = sw.get_transport(token=token)

hash = operations.send(base=obj, transports=[transport])

client.commit.create(stream_id=transport.stream_id, object_id=hash, branch_name='test')

exit()