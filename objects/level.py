from specklepy.objects.geometry import *


class Speckle2Level(Base, speckle_type='Objects.BuiltElements.Level'):
	name: str = None
	elevation: float = None
	units: str = None


class Speckle2RevitLevel(Speckle2Level, speckle_type='Objects.BuiltElements.Revit.RevitLevel'):
	createView: bool = None
	parameters: Base = None
	elementId: str = None
	referenceOnly: bool = None
