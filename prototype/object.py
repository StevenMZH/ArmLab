from prototype.quaternions.quaternion import Quaternion, rotate_vector_by_quaternion
from prototype.quaternions.rigidbody import Rigidbody
import numpy as np
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

class Cube(Rigidbody):
    def __init__(self, x, y, z, i=0, j=0, k=0, w=1, size=1.0):
        q = Quaternion(w, i, j, k)
        super().__init__(x, y, z, q)
        self.size = size

        
        # Colores de las 6 caras al estilo cubo Rubik
        # Orden: [front, back, left, right, top, bottom]
        self.face_colors = [
            "green",   # front
            "blue",    # back
            "orange",  # left
            "red",     # right
            "white",   # top
            "yellow"   # bottom
        ]

    def get_vertices(self):
        r = self.size / 2
        return np.array([
            [-r, -r, -r],
            [ r, -r, -r],
            [ r,  r, -r],
            [-r,  r, -r],
            [-r, -r,  r],
            [ r, -r,  r],
            [ r,  r,  r],
            [-r,  r,  r],
        ])

    def get_faces(self):
        # Caras definidas por índices de vértices
        return [
            [4, 5, 6, 7],  # front (z positive)
            [0, 1, 2, 3],  # back  (z negative)
            [0, 3, 7, 4],  # left  (x negative)
            [1, 2, 6, 5],  # right (x positive)
            [3, 2, 6, 7],  # top   (y positive)
            [0, 1, 5, 4],  # bottom(y negative)
        ]

    def plot(self, ax):
        vertices = self.get_vertices()
        
        # Transformar vértices por rotación y traslación
        transformed_vertices = []
        for v in vertices:
            rotated = rotate_vector_by_quaternion(v, self.q)
            transformed = (
                rotated[0] + self.coords.x,
                rotated[1] + self.coords.y,
                rotated[2] + self.coords.z,
            )
            transformed_vertices.append(transformed)
        transformed_vertices = np.array(transformed_vertices)

        faces = self.get_faces()

        # Dibujar caras con los colores correspondientes
        for i, face in enumerate(faces):
            poly = Poly3DCollection([transformed_vertices[face]])
            poly.set_facecolor(self.face_colors[i])
            poly.set_edgecolor('k')
            poly.set_alpha(0.9)
            ax.add_collection3d(poly)

        # Opcional: dibujar centro y ejes
        ax.scatter(self.coords.x, self.coords.y, self.coords.z, color='k', s=20)
        axes = [(1,0,0), (0,1,0), (0,0,1)]
        axis_colors = ['r', 'g', 'b']
        for vec, c in zip(axes, axis_colors):
            rotated = rotate_vector_by_quaternion(vec, self.q)
            ax.quiver(self.coords.x, self.coords.y, self.coords.z,
                      rotated[0], rotated[1], rotated[2], color=c, length=0.5)

