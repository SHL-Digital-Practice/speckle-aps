from specklepy.objects.geometry import *
from .level import Speckle2Level


class Speckle2Space(Base, speckle_type='Objects.BuiltElements.Space'):
	name: str = None
	number: str = None
	area: float = None
	volume: float = None
	basePoint: Point = None
	level: Speckle2Level = None
	baseOffset: float = None
	topLevel: Speckle2Level = None
	topOffset: float = None
	voids: List[Curve] = None
	outline: Curve = None
	spaceType: str = None
	zoneName: str = None
	displayMesh: Mesh = None
	units: str = None
