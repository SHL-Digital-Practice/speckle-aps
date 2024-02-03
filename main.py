import uuid
from pathlib import Path
import os

import ifcopenshell

from src.converter.converter import IfcConverter
import requests

stream_url = 'https://speckle.xyz/streams/cb3735a1c9'
project_name = 'test'
token = 'e060268f3483e9777fa5f2e52f0a88471530b8ce6b'
# file = Path(f'temp/{uuid.uuid4().hex}.ifc')
file = Path(r'D:\Documents\1Development\AEC Hackathon Zurich 2024\speckle-aps\src\temp\response2.ifc')
# ifcopenshell.open(file)
# file.parent.mkdir(parents=True, exist_ok=True)

# url = 'https://cdn.derivative.autodesk.com/dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLnJoVE5NdUthUTFhblVobUs3M0JLb2c_dmVyc2lvbj0z/output/Resource/IFC/HackathonExampleProject.ifc?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vY2RuLmRlcml2YXRpdmUuYXV0b2Rlc2suY29tL2RYSnVPbUZrYzJzdWQybHdjSEp2WkRwbWN5NW1hV3hsT25abUxuSm9WRTVOZFV0aFVURmhibFZvYlVzM00wSkxiMmNfZG1WeWMybHZiajB6L291dHB1dC9SZXNvdXJjZS9JRkMvSGFja2F0aG9uRXhhbXBsZVByb2plY3QuaWZjIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzA2OTkwNTYyfX19XX0_&Key-Pair-Id=APKAIJ4JBLIOQMJEURDQ&Signature=BRju0t6-QtNK0Em41fpyHS3Q1CESzjUsumwOFMAT6S2mzWEpUKzVZ7hCr3XeuWIdeDVtfx5isIBbieU0uU2Gj8vCPtuIrIoQKC0mgSXmn3oxD7cpCAILVLG5SfXj5tpBsbdlaOh00HxZwrPc4VvPnQAH2xKz68bGhjGOYSjrYWCCYtH9fdwnxtPclPcEWmN2YaeLMzQjKG7cGlbR5TFyfe2fJ7lb6qYFFMhiMDzLe0wTExp4cuHQ7XPDPaFLwxXOt1UT4GcT8qz79eiivactWQsPQTZSovtRBKoyqks9XuPq8muM~wi8FaGEef-uDeCAD5Oa4P3I~r-ffFx6iP-GbA__'

# response = requests.get(url)
# with open(file, 'wb') as f:
#     f.write(response.content)

converter = IfcConverter()
converter.open_ifc(file)
converter.convert_to_speckle()
converter.compute_lca()
obj_id, commit_url = converter.send_to_speckle(token, stream_url, project_name)

# os.remove(file)

exit()