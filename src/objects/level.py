from specklepy.objects.geometry import *


class Speckle2Level(Base, speckle_type='Objects.BuiltElements.Level'):
	name: str = None
	elevation: float = None
	units: str = None
