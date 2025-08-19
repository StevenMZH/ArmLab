import math
from core.quaternions.quaternion import Quaternion
from core.quaternions.coords import Coords

class QObject:
    from core.doc_builder.LatexDoc import LatexDoc
    def __init__(self, x, y, z, quaternion: Quaternion = Quaternion(1, 0, 0, 0), name="P", key="1", doc:LatexDoc=None):
        self.coords = Coords(x, y, z)
        self.q = quaternion

        self.doc = doc
        self.name = name
        self.key = key

        self.latex_procedures = []  # Lista de bloques LaTeX
        self.step_counter = 1       # Contador de pasos
        
        self.latex_procedures.append((
            f"\\subsubsection*{{Definicion de ({self.name})}}\n"
            "\[Object_1 = \\big( \\vec{p}_1, \, q_1 \\big)\]"
            "donde: \[ \vec{p}_1 =  \\begin{bmatrix} x_1 \\\\ y_1 \\\\ z_1 \end{bmatrix} \in \mathbb{R}^3 \quad \\text{y} \quad q_1 =  \\begin{bmatrix} w_1 \\\\ x_1 \\\\ y_1 \\\\ z_1 \end{bmatrix} \in \mathbb{H} \]"
            "\\[\n"
            "&q_0= " + self._q_to_bm4(self.q) + "\\\\[6pt]\n\]"
        ))
        
        if self.doc: self.doc.QObject_instance(self)

    def __repr__(self):
        return f"QObject( {self.coords}, {self.q} )"

    # ---------- Helpers de formateo LaTeX ----------
    @staticmethod
    def _fmt(v, nd=4):
        if abs(v) < 5e-13:  # Evitar -0.0000
            v = 0.0
        return f"{v:.{nd}f}"

    def _bm3(self, x, y, z):
        return (
            "\\begin{bmatrix} "
            f"{self._fmt(x)} \\\\ {self._fmt(y)} \\\\ {self._fmt(z)}"
            " \\end{bmatrix}"
        )

    def _bm4(self, w, x, y, z):
        return (
            "\\begin{bmatrix} "
            f"{self._fmt(w)} \\\\ {self._fmt(x)} \\\\ {self._fmt(y)} \\\\ {self._fmt(z)}"
            " \\end{bmatrix}"
        )

    def _q_to_bm4(self, q: Quaternion):
        return self._bm4(q.w, q.x, q.y, q.z)

    def _rotate_vector_by_quaternion(self, vector, q: Quaternion):
        v = Quaternion(0, *vector)
        rotated = q * v * q.inverse()
        return (rotated.x, rotated.y, rotated.z)

    # ---------- Operaciones ----------
    def translate(self, delta: Coords):
        """Traslación en ejes locales: rota el delta por la orientación actual y suma en global."""
        step_num = self.step_counter
        self.step_counter += 1

        p_before = (self.coords.x, self.coords.y, self.coords.z)
        local_delta = (delta.x, delta.y, delta.z)

        dxg, dyg, dzg = self._rotate_vector_by_quaternion(local_delta, self.q)
        self.coords += Coords(dxg, dyg, dzg)
        p_after = (self.coords.x, self.coords.y, self.coords.z)

        block = (
            f"\\subsubsection*{{Paso {step_num}: Traslación de {self.name}}}\n"
            "\\[\n"
            "\\begin{aligned}\n"
            f"&\\textbf{{{self.name}: Traslación (ejes locales)}}\\\\[2pt]\n"
            f"&{self.name}_{{antes}} = " + self._bm3(*p_before) + "\\\\[6pt]\n"
            "&\\Delta {p}_{local} = " + self._bm3(*local_delta) + "\\\\[6pt]\n"
            "&q = " + self._q_to_bm4(self.q) + "\\\\[6pt]\n"
            "&\\Delta {p}_{global} = ( q\\,(0,\\Delta p)\\,q^{-1} )_{xyz} = "
                + self._bm3(dxg, dyg, dzg) + "\\\\[6pt]\n"
            f"&{self.name}' = {self.name} + \\Delta "+"{p}_{global} = "
                + self._bm3(*p_after) + "\n"
            "\\end{aligned}\n"
            "\\]\n"
        )
        self.latex_procedures.append(block)
        
        if self.doc:
            self.doc.add_QTranslation(
                name=self.name,
                key=self.key,
                p_i=Coords(p_before[0], p_before[1], p_after[2]),
                dp_local=Coords(local_delta[0], local_delta[1], local_delta[2]),
                dp_global=Coords(dxg, dyg, dzg),
                p_f=self.coords,
                q_i=self.q
            )
        return self

    def rotate_x(self, theta: float):
        rotation = Quaternion.rotate_x(theta)
        self._apply_rotation(rotation, axis="x", theta=theta)
        return self

    def rotate_y(self, theta: float):
        rotation = Quaternion.rotate_y(theta)
        self._apply_rotation(rotation, axis="y", theta=theta)
        return self

    def rotate_z(self, theta: float):
        rotation = Quaternion.rotate_z(theta)
        self._apply_rotation(rotation, axis="z", theta=theta)
        return self

    def _apply_rotation(self, rotation_quaternion: Quaternion, axis=None, theta=None):
        step_num = self.step_counter
        self.step_counter += 1

        q_i = Quaternion(self.q.w, self.q.x, self.q.y, self.q.z)
        self.q = rotation_quaternion * self.q
        q_f = self.q

        if axis is not None and theta is not None:
            half = theta / 2.0
            cosh = math.cos(half)
            sinh = math.sin(half)
            if axis == "x":
                qrot = (cosh,  sinh, 0.0,  0.0)
                axis_name = "X"
            elif axis == "y":
                qrot = (cosh, 0.0,  sinh, 0.0)
                axis_name = "Y"
            else:
                qrot = (cosh, 0.0, 0.0,  sinh)
                axis_name = "Z"

            deg = math.degrees(theta)

            block = (
                f"\\subsubsection*{{Paso {step_num}: Rotación de {self.name} alrededor de {axis_name}}}\n"
                "\\[\n"
                "\\begin{aligned}\n"
                f"&\\textbf{{{self.name}: Rotación alrededor del eje {axis_name}}}\\\\[2pt]\n"
                "&\\theta = " + self._fmt(theta, 3) + "\\,\\text{rad} \\; ("
                    + self._fmt(deg, 3) + "^\\circ)\\\\[6pt]\n"
                "&q_{antes} = " + self._q_to_bm4(q_i) + "\\\\[6pt]\n"
                "&q_{\\mathrm{rot}} = \\begin{cases}\n"
                "\\;\\big(\\cos(\\tfrac{\\theta}{2}),\\;\\sin(\\tfrac{\\theta}{2}),\\;0,\\;0\\big) & \\text{si } X\\\\\n"
                "\\;\\big(\\cos(\\tfrac{\\theta}{2}),\\;0,\\;\\sin(\\tfrac{\\theta}{2}),\\;0\\big) & \\text{si } Y\\\\\n"
                "\\;\\big(\\cos(\\tfrac{\\theta}{2}),\\;0,\\;0,\\;\\sin(\\tfrac{\\theta}{2})\\big) & \\text{si } Z\n"
                "\\end{cases}\\\\[6pt]\n"
                "&q_{rot}\\ \\text{(num)} = " + self._bm4(*qrot) + "\\\\[6pt]\n"
                "&\\text{Orden de multiplicación: }\\; q' = q_{rot}\\cdot q\\\\[6pt]\n"
                "&q' = " + self._q_to_bm4(q_f) + "\n"
                "\\end{aligned}\n"
                "\\]\n"
            )
            self.latex_procedures.append(block)

        if self.doc:
            self.doc.add_QRotation(
                name=self.name,
                key=self.key,
                q_i=q_i,
                q_f=q_f,
                theta=theta,
                axis=axis
            )

    def doc_finalvalues(self):
        if self.doc:
            self.doc.QObject_last_values(self)

    def procedures(self):
        return "\n".join(self.latex_procedures)
