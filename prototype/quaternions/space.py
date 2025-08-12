import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

from prototype.quaternions.rigidbody import Rigidbody

class Space:
    def __init__(self, objects: list[Rigidbody]):
        self.space = Rigidbody(0, 0, 0)
        self.objects = objects

    def plot(self):
        fig = plt.figure()
        ax = fig.add_subplot(111, projection='3d')

        # Dibujar todos los objetos
        for obj in self.objects:
            obj.plot(ax)

        # Ejes globales fijos en el origen
        ax.quiver(0, 0, 0, 1, 0, 0, color='red', length=1)
        ax.quiver(0, 0, 0, 0, 1, 0, color='green', length=1)
        ax.quiver(0, 0, 0, 0, 0, 1, color='blue', length=1)

        # Colores de fondo (grid panes)
        gray_light = (0.9, 0.9, 0.9, 1)
        gray_medium = (0.7, 0.7, 0.7, 1)
        gray_dark = (0.5, 0.5, 0.5, 1)

        ax.xaxis.set_pane_color(gray_light)
        ax.yaxis.set_pane_color(gray_medium)
        ax.zaxis.set_pane_color(gray_dark)

        # Límite fijo del espacio
        ax.set_xlim(-5, 5)
        ax.set_ylim(-5, 5)
        ax.set_zlim(-5, 5)
        ax.set_box_aspect([1, 1, 1])

        ax.set_xlabel("X")
        ax.set_ylabel("Y")
        ax.set_zlabel("Z")

        plt.show()
