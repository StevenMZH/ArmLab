
class Coords:
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z
        
    def __add__(self, other):
        self.x = self.x + other.x
        self.y = self.y + other.y
        self.z = self.z + other.z
        return self
    
    def __sub__(self, other):
        self.x = self.x - other.x
        self.y = self.y - other.y
        self.z = self.z - other.z
        return self
