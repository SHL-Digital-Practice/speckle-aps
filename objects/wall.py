from specklepy.objects.geometry import *
from .level import Speckle2Level


class Speckle2Wall(Base, speckle_type='Objects.BuiltElements.Wall'):
    height: float = None
    elements: List[Base] = None
    baseLine: Curve = None
    displayMesh: Mesh = None
    units: str = None

class Speckle2RevitWall(Speckle2Wall, speckle_type='Objects.BuiltElements.Revit.RevitWall'):
    family: str = None
    type: str = None
    baseOffset: float = None
    topOffset: float = None
    flipped: bool = None
    structural: bool = None
    level: Speckle2Level = None
    topLevel: Speckle2Level = None
    parameters: Base = None
    elementId: str = None
