from specklepy.objects.geometry import *
from .level import Speckle2Level


class Speckle2Wall(Base, speckle_type='Objects.BuiltElements.Wall'):
    height: float = None
    elements: List[Base] = None
    baseLine: Curve = None
    displayMesh: Mesh = None
    units: str = None
    volume: float = None
    thickness: float = None
