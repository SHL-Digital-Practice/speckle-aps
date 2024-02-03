from src.converter.converter import IfcConverter

target_url = 'https://speckle.xyz/streams/cb3735a1c9/branches/test'
token = '902d92398804e5f0afe1f1c92ea89e8a48797d4ffa'
file = 'response.ifc'

converter = IfcConverter()
converter.open_ifc(file)
converter.to_speckle(token, target_url)

exit()