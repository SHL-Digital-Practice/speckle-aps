from specklepy.objects.geometry import *
from .level import Speckle2Level


class Speckle2Floor(Base, speckle_type='Objects.BuiltElements.Floor'):
	outline: Curve = None
	voids: List[Curve] = None
	elements: List[Base] = None
	displayMesh: Mesh = None
	units: str = None
