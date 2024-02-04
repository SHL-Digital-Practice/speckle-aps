from specklepy.objects.geometry import *
from .level import Speckle2Level


class Speckle2Beam(Base, speckle_type='Objects.BuiltElements.Beam'):
	baseLine: Curve = None
	displayMesh: Mesh = None
	units: str = None
