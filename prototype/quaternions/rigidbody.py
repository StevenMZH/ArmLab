from prototype.quaternions.quaternion import Quaternion
from prototype.quaternions.coords import Coords

class Rigidbody:
    def __init__(self, x, y, z, quaternion:Quaternion = Quaternion(1,0,0,0)):
        self.coords = Coords(x, y, z)
        self.q = quaternion

        
    def relative_to(self, parent: "Rigidbody"):
        # Diferencia de posiciones (global)
        dx = self.coords.x - parent.coords.x
        dy = self.coords.y - parent.coords.y
        dz = self.coords.z - parent.coords.z
        delta_pos = Quaternion(0, dx, dy, dz)  # cuaternión puro

        # Posición relativa: rotar hacia el marco local del padre
        qA_inv = parent.q.inverse()
        rel_pos_q = qA_inv * delta_pos * parent.q
        rel_coords = Coords(rel_pos_q.x, rel_pos_q.y, rel_pos_q.z)

        # Rotación relativa: q_rel = q_parent^-1 * q_self
        rel_rot = qA_inv * self.q

        # Crear y devolver Rigidbody relativo
        relative = Rigidbody(rel_coords.x, rel_coords.y, rel_coords.z)
        relative.q = rel_rot
        return relative
