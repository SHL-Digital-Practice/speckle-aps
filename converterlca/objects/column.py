from specklepy.objects.geometry import *
from .level import Speckle2Level


class Speckle2Column(Base, speckle_type='Objects.BuiltElements.Column'):
	baseLine: Curve = None
	displayMesh: Mesh = None
	units: str = None
