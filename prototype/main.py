import math
import numpy as np
from prototype.quaternions.quaternion import Quaternion
from prototype.quaternions.object import Cube
from prototype.quaternions.space import Space

if __name__ == "__main__":
    # Crear Cubos
    cube1 = Cube(0, 0, 0, w=1)  # Cubo sin rotación

    angle = np.radians(45)
    q_rot = Quaternion(np.cos(angle/2), 0, 0, np.sin(angle/2))  # Rotación en Z
    cube2 = Cube(2, 0, 0, w=q_rot.w, i=q_rot.x, j=q_rot.y, k=q_rot.z, size=1)

    # Crear espacio con cubos
    space = Space(objects=[cube1, cube2])
    space.plot()
