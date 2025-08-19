import math

class Quaternion:
    def __init__(self, w=0, x=0, y=0, z=0):
        self.w = w  # scalar
        self.x = x  # i
        self.y = y  # j
        self.z = z  # k

    def __repr__(self):
        return f"{self.w} + {self.x}i + {self.y}j + {self.z}k"

    # Quaternion Addition
    def __add__(self, other):
        return Quaternion(
            self.w + other.w,
            self.x + other.x,
            self.y + other.y,
            self.z + other.z
        )

    # Quaternion Subtraction
    def __sub__(self, other):
        return Quaternion(
            self.w - other.w,
            self.x - other.x,
            self.y - other.y,
            self.z - other.z
        )

    # Quaternion Mult (Hamilton Product)
    def __mul__(self, other):
        w1, x1, y1, z1 = self.w, self.x, self.y, self.z
        w2, x2, y2, z2 = other.w, other.x, other.y, other.z
        return Quaternion(
            w1*w2 - x1*x2 - y1*y2 - z1*z2,
            w1*x2 + x1*w2 + y1*z2 - z1*y2,
            w1*y2 - x1*z2 + y1*w2 + z1*x2,
            w1*z2 + x1*y2 - y1*x2 + z1*w2
        )

    # Conjugated
    def conjugate(self):
        return Quaternion(self.w, -self.x, -self.y, -self.z)

    # Norm
    def norm(self):
        return math.sqrt(self.w**2 + self.x**2 + self.y**2 + self.z**2)

    # Inverse
    def inverse(self):
        norm_squared = self.norm() ** 2
        if norm_squared == 0:
            raise ZeroDivisionError("No se puede invertir un cuaternión con norma cero")
        conjugate = self.conjugate()
        return Quaternion(
            conjugate.w / norm_squared,
            conjugate.x / norm_squared,
            conjugate.y / norm_squared,
            conjugate.z / norm_squared
        )

    # Division (q1 / q2 = q1 * q2^-1)
    def __truediv__(self, other):
        return self * other.inverse()


    def rotate_x(theta):
        return Quaternion(math.cos(theta / 2), math.sin(theta / 2), 0, 0)

    def rotate_y(theta):
        return Quaternion(math.cos(theta / 2), 0, math.sin(theta / 2), 0)
    
    def rotate_z(theta):
        return Quaternion(math.cos(theta / 2), 0, 0, math.sin(theta / 2))

    def to_euler_angles(self):
        """
        Convert quaternion to Euler angles (roll, pitch, yaw) in radians.
        Roll  = rotation around X axis
        Pitch = rotation around Y axis
        Yaw   = rotation around Z axis
        """
        # Roll (X-axis rotation)
        sinr_cosp = 2 * (self.w * self.x + self.y * self.z)
        cosr_cosp = 1 - 2 * (self.x * self.x + self.y * self.y)
        roll = math.atan2(sinr_cosp, cosr_cosp)

        # Pitch (Y-axis rotation)
        sinp = 2 * (self.w * self.y - self.z * self.x)
        if abs(sinp) >= 1:
            pitch = math.copysign(math.pi / 2, sinp)  # Gimbal lock
        else:
            pitch = math.asin(sinp)

        # Yaw (Z-axis rotation)
        siny_cosp = 2 * (self.w * self.z + self.x * self.y)
        cosy_cosp = 1 - 2 * (self.y * self.y + self.z * self.z)
        yaw = math.atan2(siny_cosp, cosy_cosp)

        return roll, pitch, yaw


def rotate_vector_by_quaternion(vector, rotation_quaternion):
    q = rotation_quaternion
    q_inv = q.inverse()
    v = Quaternion(0, *vector)  # Cuaternión puro que representa el vector
    rotated = q * v * q_inv
    return (rotated.x, rotated.y, rotated.z)  # Coordenadas 3D resultantes


if __name__ == "__main__":
    q1 = Quaternion(1, 2, 3, 4)
    q2 = Quaternion(5, 6, 7, 8)

    print("Suma:", q1 + q2)
    print("Resta:", q1 - q2)
    print("Multiplicación:", q1 * q2)
    print("Conjugado de q1:", q1.conjugate())
    print("Norma de q1:", q1.norm())
    print("Inversa de q1:", q1.inverse())
    print("División q1 / q2:", q1 / q2)
