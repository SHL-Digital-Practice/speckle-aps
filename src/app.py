import json
import uuid
from pathlib import Path
import os

from flask import Flask
from flask import request
import requests
from specklepy.api import operations

# Add to path
import sys
import os
sys.path.append(str(Path(os.getcwd()).parent))

from src.converter.converter import IfcConverter

from specklepy.api.wrapper import StreamWrapper
from specklepy.objects import Base

app = Flask(__name__)


@app.get('/ifc_to_speckle')
def ifc_to_speckle():

    stream_url = 'https://speckle.xyz/streams/cb3735a1c9'
    token = '902d92398804e5f0afe1f1c92ea89e8a48797d4ffa'
    file = Path(f'temp/{uuid.uuid4().hex}.ifc')
    file.parent.mkdir(parents=True, exist_ok=True)

    url = request.args.get('url')
    project_name = request.args.get('project_name')

    response = requests.get(url)
    with open(file, 'wb') as f:
        f.write(response.content)

    converter = IfcConverter()
    converter.open_ifc(file)
    converter.convert_to_speckle()
    converter.compute_lca()
    obj_id, commit_url = converter.send_to_speckle(token, stream_url, project_name)

    os.remove(file)

    response = {
        'object_id': obj_id,
        'commit_url': commit_url
    }

    return response


@app.post('/compute_lca')
def compute_lca():

    speckle_project = operations.deserialize(json.dumps(request.json))

    converter = IfcConverter()
    converter.speckle_project = speckle_project
    converter.compute_lca()

    # stream_url = 'https://speckle.xyz/streams/cb3735a1c9'
    # token = '902d92398804e5f0afe1f1c92ea89e8a48797d4ffa'
    # obj_id, commit_url = converter.send_to_speckle(token, stream_url, 'test')

    speckle_obj = operations.serialize(converter.speckle_project)

    return speckle_obj


def compute_lca_test():

    # stream_url = 'https://speckle.xyz/streams/cb3735a1c9/commits/4ee035a400'
    stream_url = 'https://speckle.xyz/streams/cb3735a1c9/commits/d59fe3e42d'
    token = '902d92398804e5f0afe1f1c92ea89e8a48797d4ffa'

    sw = StreamWrapper(stream_url)
    client = sw.get_client(token=token)
    transport = sw.get_transport(token=token)

    commit = client.commit.get(stream_id=sw.stream_id, commit_id=sw.commit_id)

    hash_obj = commit.referencedObject
    speckle_obj = operations.receive(obj_id=hash_obj, remote_transport=transport)

    converter = IfcConverter()
    converter.speckle_project = speckle_obj
    converter.compute_lca()

    obj_id, commit_url = converter.send_to_speckle(token, stream_url, 'test')

    content = operations.serialize(speckle_obj)

    with open('test.json', 'w') as f:
        f.write(content)

    return




if __name__  == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)
