import uuid
from pathlib import Path
import os

from flask import Flask
from flask import request
import requests
from src.converter.converter import IfcConverter

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


if __name__  == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)
