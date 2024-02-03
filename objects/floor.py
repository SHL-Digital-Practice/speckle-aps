from specklepy.objects.geometry import *
from .level import Speckle2Level


class Speckle2Floor(Base, speckle_type='Objects.BuiltElements.Floor'):
	outline: Curve = None
	voids: List[Curve] = None
	elements: List[Base] = None
	displayMesh: Mesh = None
	units: str = None


class Speckle2RevitFloor(Speckle2Floor, speckle_type='Objects.BuiltElements.Revit.RevitFloor'):
	family: str = None
	type: str = None
	level: Speckle2Level = None
	structural: bool = None
	slope: float = None
	slopeDirection: Line = None
	parameters: Base = None
	elementId: str = None
