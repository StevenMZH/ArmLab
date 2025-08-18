import subprocess
import os
import math
from math import cos, sin, atan2, asin, degrees
from pathlib import Path

class LatexDoc:
    def __init__(self):
        self.doc = ""
        self.content = []
        pass
    
    def QObject_definition(self):
        self.content.append((
            "\\newcommand{\shorttitle}{Quackternion: Posicion y Orientacion de Objetos en un espacio 3D}"
            "\\begin{document}"

            "\\section*{Definicion de Object} \n"
            "Definimos un objeto en el espacio tridimensional como el par\n"
            "\[ \\text{Object} = \\big( \\vec{p}, \, q \\big) \]\n"      
            "donde:\n"
            "\[\n"
            "\\vec{p} = \\begin{bmatrix} x \\\\ y \\\\ z \end{bmatrix} \in \mathbb{R}^3\n"
            "\quad \\text{y} \quad\n"
            "q = \\begin{bmatrix} w \\\\ x \\\\ y \\\\ z \end{bmatrix} \in \mathbb{H}.\n"
            "\] \n\n"

            f"$p_{{i}}$: Posición inicial de Objeto, antes de aplicar la transformacion \n\n"
            f"$q_{{i}}$: Orientacion inicial del Objeto, antes de aplicar la transformacion \n\n"
            f"$\\Delta \\vec{{p}}_{{local}}$: Vector de Traslacion relativo al objeto\n\n"
            f"$\\Delta \\vec{{p}}_{{global}}$: Vector de Traslacion absoluto\n\n"
            f"$q_{{rot}}$: Cuaternión de rotación aplicado \n\n"
            f"$p_{{i+1}}$: Posición final del Objeto, despues de aplicar la transformacion \n\n"
            f"$q_{{i+1}}$: Orientación final del Objeto, despues de aplicar la transformacion \n\n"

            # Translation Formula
            f"\\subsubsection*{{Formulas para la Traslacion}}\n"
            f"\[ (0, \\Delta \\vec{{p}}_{{local}}) = v = \\begin{{bmatrix}} 0 \\\\ d_x \\\\ d_y \\\\ d_z \end{{bmatrix}}, \quad"
            f"\Delta \\vec{{p}}_{{\\text{{global}}}} = q \, (0, \\Delta \\vec{{p}}_{{local}}) \, q^{{-1}} = q \, v \, q^{{-1}} = \\begin{{bmatrix}} q_w \\\\ q_x \\\\ q_y \\\\ q_z \end{{bmatrix}} \cdot \\begin{{bmatrix}} 0 \\\\ d_x \\\\ d_y \\\\ d_z \end{{bmatrix}} \cdot \\begin{{bmatrix}} q_w \\\\ -q_x \\\\ -q_y \\\\ -q_z \end{{bmatrix}} \]\n\n"
            f"\[ \\vec{{p}}_{{i+1}} = \\vec{{p}}_{{i}} + \\Delta \\vec{{p}}_{{global}}\]\n\n" 
        
            # Rotation Formula
            f"\\subsubsection*{{Formulas para la Rotacion}}\n"
            "\\[ q_{rot}(\\theta, axis) = \n"
            "\\begin{cases}\n"
            "\\; (\\cos(\\tfrac{\\theta}{2}),\\;\\sin(\\tfrac{\\theta}{2}),\\;0,\\;0) & \\text{si } X\\\\\n"
            "\\; (\\cos(\\tfrac{\\theta}{2}),\\;0,\\;\\sin(\\tfrac{\\theta}{2}),\\;0) & \\text{si } Y\\\\\n"
            "\\; (\\cos(\\tfrac{\\theta}{2}),\\;0,\\;0,\\;\\sin(\\tfrac{\\theta}{2})) & \\text{si } Z\n"
            "\\end{cases}\n"
            "\\]\n\n"
            f"\[ q_{{i+1}} = q_{{rot}} \cdot q_{{i}}\]\n\n"

            # Producto de Quaterniones
            f"\\subsubsection*{{Producto de Cuaterniones}}\n"
            "Sean dos cuaterniones definidos como:\n"
            "\[\n"
            f"q_1 = \\begin{{bmatrix}} w_1 \\\\ x_1 \\\\ y_1 \\\\ z_1 \\end{{bmatrix}}, \\quad "
            f"q_2 = \\begin{{bmatrix}} w_2 \\\\ x_2 \\\\ y_2 \\\\ z_2 \\end{{bmatrix}}\n"
            "\]\n"
            "El producto de cuaterniones $q = q_1 \\cdot q_2$ se define como:\n"
            "\[\n"
            "q = \\begin{bmatrix} w \\\\ x \\\\ y \\\\ z \\end{bmatrix} = "
            "\\begin{bmatrix} "
            "w_1 w_2 - x_1 x_2 - y_1 y_2 - z_1 z_2 \\\\ "
            "w_1 x_2 + x_1 w_2 + y_1 z_2 - z_1 y_2 \\\\ "
            "w_1 y_2 - x_1 z_2 + y_1 w_2 + z_1 x_2 \\\\ "
            "w_1 z_2 + x_1 y_2 - y_1 x_2 + z_1 w_2 "
            "\\end{bmatrix}\n"
            "\]\n"
            "Aquí $w$ es la parte real y $(x, y, z)$ son las componentes imaginarias.\n\n"

            # Quaternion to Euler Angles
            f"\\subsubsection*{{Quaterniones a Ángulos de Euler}}\n"
            f"Los ángulos de Euler (roll, pitch, yaw) en radianes, para la orientacion final:\n"
            f"\[\n \\text{{roll}}\\,(X) = \\phi = \\arctan2(2(q_w \\cdot q_x + q_y \\cdot q_z), 1 - 2(q_x^2 + q_y^2))\n \]\n"
            f"\[\n \\text{{pitch}}\\,(Y) = \\theta = \\arcsin(2(q_w \\cdot q_y - q_z \\cdot q_x))\n \]\n"
            f"\[\n \\text{{yaw}}\\,(Z) = \\psi = \\arctan2(2(q_w \\cdot q_z + q_x \\cdot q_y), 1 - 2(q_y^2 + q_z^2))\n \]\n"

        ))
    
    def QObject_instance(self, obj):
        self.content.append((
            f"\\newpage\n"
            f" \section*{{{obj.name}}}\n"
            f"Consideremos un objeto particular, al que llamaremos ${obj.name}$, definido como:\n"
            "\[ \n"
            f"\\text{{Object}}_{obj.key} = \\big( \\vec{{p}}_{obj.key}, \, q_{obj.key} \\big)\n"
            "\]\n"
            "donde inicialmente:\n"
            "\[\n"
            f"\\vec{{p}}_{obj.key} = \\begin{{bmatrix}} {obj.coords.x} \\\\ {obj.coords.y} \\\\ {obj.coords.z} \end{{bmatrix}} \in \mathbb{{R}}^3\n"
            f"\quad \\text{{y}} \quad\n"
            f"q_{obj.key} = \\begin{{bmatrix}} {formatN(obj.q.w)} \\\\ {formatN(obj.q.x)} \\\\ {formatN(obj.q.y)} \\\\ {formatN(obj.q.z)} \end{{bmatrix}} \in \mathbb{{H}}.\n"
            "\]\n"
        ))
        
    def add_QTranslation(self, name, key, p_i, dp_local=None, q_i=None, dp_global=None, p_f=None):
        """Agrega un bloque de transformación (traslación o rotación)"""
        # title
        block = f"\\subsection*{{Traslacion relativa de ({formatN(dp_local.x)}, {formatN(dp_local.y)}, {formatN(dp_local.z)}) }}\n"
            
        # Var init
        block += f"\\subsubsection*{{Parametros iniciales}}\n"
        block += f"\[ \\vec{{p}}_{{{key}, i}} = \\begin{{bmatrix}} p_x \\\\ p_y \\\\ p_z \end{{bmatrix}} = \\begin{{bmatrix}} {formatN(p_i.x)} \\\\ {formatN(p_i.y)} \\\\ {formatN(p_i.z)} \end{{bmatrix}}, \quad \n" 
        block += f"\Delta \\vec{{p}}_{{{key},local}} = \\begin{{bmatrix}} d_x \\\\ d_y \\\\ d_z \end{{bmatrix}} = \\begin{{bmatrix}} {formatN(dp_local.x)} \\\\ {formatN(dp_local.y)} \\\\ {formatN(dp_local.z)} \end{{bmatrix}}, \quad \n" 
        block += f"q_{{{key}, i}} = \\begin{{bmatrix}} q_w \\\\ q_x \\\\ q_y \\\\ q_z \end{{bmatrix}} = \\begin{{bmatrix}} {formatN(q_i.w)} \\\\ {formatN(q_i.x)} \\\\ {formatN(q_i.y)} \\\\ {formatN(q_i.z)} \end{{bmatrix}} \]\n\n"
             
        # delta p to Quaternion
        block += f"\\subsubsection*{{Rotación del Vector Local hacia el espacio global}}\n\n"
        block += f"\[ v = \\begin{{bmatrix}} 0 \\\\ d_x \\\\ d_y \\\\ d_z \end{{bmatrix}} = \\begin{{bmatrix}} 0 \\\\ {formatN(dp_local.x)} \\\\ {formatN(dp_local.y)} \\\\ {formatN(dp_local.z)} \end{{bmatrix}}\]"
        
        # P global
        block += f"\[ \Delta \\vec{{p}}_{{\\text{{global}}}} = q \cdot v \cdot q^{{-1}} = \\begin{{bmatrix}} - (q_x d_x + q_y d_y + q_z d_z) \\\\ q_w d_x + q_y d_z - q_z d_y \\\\ q_w d_y - q_x d_z + q_z d_x \\\\ q_w d_z + q_x d_y - q_y d_x \end{{bmatrix}} \cdot \\begin{{bmatrix}} q_w \\\\ -q_x \\\\ -q_y \\\\ -q_z \end{{bmatrix}} \]\n\n"
        block += f"\[ \Delta \\vec{{p}}_{{\\text{{global}}}} = \\begin{{bmatrix}} - (q_x d_x + q_y d_y + q_z d_z) \\\\ q_w d_x + q_y d_z - q_z d_y \\\\ q_w d_y - q_x d_z + q_z d_x \\\\ q_w d_z + q_x d_y - q_y d_x \end{{bmatrix}} \cdot \\begin{{bmatrix}} {formatN(q_i.w)} \\\\ -{formatN(q_i.x)} \\\\ -{formatN(q_i.y)} \\\\ -{formatN(q_i.z)} \end{{bmatrix}} \]\n\n"
        block += f"\[ \Delta \\vec{{p}}_{{global}} = \\begin{{bmatrix}} {formatN(dp_global.x)} \\\\ {formatN(dp_global.y)} \\\\ {formatN(dp_global.z)} \\end{{bmatrix}} \n\]"
        
        # P final
        block += f"\\textbf{{Traslacion de la posición global}}\n\n"
        block += f"\[ \\vec{{p}}_{{{key}, i+1}} = \\vec{{p}}_{{{key}, i}} + \\Delta \\vec{{p}}_{{{key}, global}} = "
        block += f" = \\begin{{bmatrix}} {formatN(p_i.x)} + {formatN(dp_global.x)} \\\\ {formatN(p_i.y)} + {formatN(dp_global.y)} \\\\ {formatN(p_i.z)} + {formatN(dp_global.z)} \\end{{bmatrix}}\] \n\n"
        block += f"\[\\vec{{p}}_{{{key},i+1}} = \\begin{{bmatrix}} {formatN(p_f.x)} \\\\ {formatN(p_f.y)} \\\\ {formatN(p_f.z)} \\end{{bmatrix}}\n\]"
        
        self.content.append(block)

    def add_QRotation(self, name, key, q_i, q_f, theta, axis):
        """Agrega un bloque LaTeX que describe la rotación de un objeto"""
        block = f"\\subsection*{{Rotacion en el eje {axis.upper()} de $\mathbf{{{formatN(math.degrees(theta),2)}^\\circ}}$ }}\n"

        # Definiciones
        
        # Parámetros iniciales
        block += (
            "\\subsubsection*{Parámetros iniciales}\n"
            f"\[ q_{{{key}, i}} = \\begin{{bmatrix}} {formatN(q_i.w)} \\\\ {formatN(q_i.x)} \\\\ {formatN(q_i.y)} \\\\ {formatN(q_i.z)} \\end{{bmatrix}}, \quad"
            f" \\theta_{axis} = {formatN(math.degrees(theta),2)}^\\circ = {formatN(theta)}\;  rad  \]\n\n"
        )

        # Ángulo y eje
        block += f"\\subsubsection*{{Rotación alrededor del eje {axis.upper()}}}\n"
        
        q_rot = ""
        if(axis == "x"):
            block += f"\\[ q_{{rot}}({formatN(math.degrees(theta),2)}^\\circ, x) = \\begin{{bmatrix}} \\cos(\\tfrac{{\\theta}}{{2}}) \\\\ \\sin(\\tfrac{{\\theta}}{{2}}) \\\\ 0 \\\\ 0 \\end{{bmatrix}}"
            q_rot = f"= \\begin{{bmatrix}} {formatN(cos(theta/2))} \\\\ {formatN(sin(theta/2))} \\\\ 0 \\\\ 0 \\end{{bmatrix}}"
            block += q_rot + "\]\n\n"
        elif(axis == "y"):
            block += f"\\[ q_{{rot}}({formatN(math.degrees(theta),2)}^\\circ, y) = \\begin{{bmatrix}} \\cos(\\tfrac{{\\theta}}{{2}}) \\\\ 0 \\\\ \\sin(\\tfrac{{\\theta}}{{2}}) \\\\ 0 \\end{{bmatrix}}"
            q_rot += f"= \\begin{{bmatrix}} {formatN(cos(theta/2))} \\\\ 0 \\\\ {formatN(sin(theta/2))} \\\\ 0 \\end{{bmatrix}}"
            block += q_rot + "\]\n\n"
        elif(axis == "z"):
            block += f"\\[ q_{{rot}}({formatN(math.degrees(theta),2)}^\\circ, z) = \\begin{{bmatrix}} \\cos(\\tfrac{{\\theta}}{{2}}) \\\\ 0 \\\\ 0 \\\\ \\sin(\\tfrac{{\\theta}}{{2}}) \\end{{bmatrix}}"
            q_rot += f"= \\begin{{bmatrix}} {formatN(cos(theta/2))} \\\\ 0 \\\\ 0 \\\\ {formatN(sin(theta/2))} \\end{{bmatrix}}"
            block += q_rot + "\]\n\n"


        # Fórmula de actualización
        block += (
            f"\\subsubsection*{{Actualización de la orientación}}\n"
            f"\[ q_{{{key}, i+1}} = q_{{rot}} \cdot q_{{{key}, i}} = {q_rot} \cdot \\begin{{bmatrix}} {formatN(q_i.w)} \\\\ {formatN(q_i.x)} \\\\ {formatN(q_i.y)} \\\\ {formatN(q_i.z)} \\end{{bmatrix}}\]\n"            
            f"\[ q_{{{key}, i+1}} = "
            f"\\begin{{bmatrix}} {formatN(q_f.w)} \\\\ {formatN(q_f.x)} \\\\ {formatN(q_f.y)} \\\\ {formatN(q_f.z)} \\end{{bmatrix}} \]\n"
        )

        self.content.append(block)

    def QObject_last_values(self, obj):
        roll  = atan2(2*(obj.q.w*obj.q.x + obj.q.y*obj.q.z), 1 - 2*(obj.q.x**2 + obj.q.y**2))
        pitch = asin(2*(obj.q.w*obj.q.y - obj.q.z*obj.q.x))
        yaw   = atan2(2*(obj.q.w*obj.q.z + obj.q.x*obj.q.y), 1 - 2*(obj.q.y**2 + obj.q.z**2))
        self.content.append((
            f" \subsection*{{Valores Finales}}\n"
            f"\[\n \\vec{{p}}_{obj.key} = \\begin{{bmatrix}} {formatN(obj.coords.x)} \\\\ {formatN(obj.coords.y)} \\\\ {formatN(obj.coords.z)} \end{{bmatrix}}"
            f"\quad , \quad\n"
            f"q_{obj.key} = \\begin{{bmatrix}} {formatN(obj.q.w)} \\\\ {formatN(obj.q.x)} \\\\ {formatN(obj.q.y)} \\\\ {formatN(obj.q.z)} \end{{bmatrix}}\]\n"
            
            f"\\subsubsection*{{Orientacion final como Ángulos de Euler}}\n"
            f"Los ángulos de Euler (roll, pitch, yaw), para la orientacion final:\n"
            f"\[\n \\text{{roll}}\\,(X) = \\phi = \\arctan2(2({formatN(obj.q.w)} \\cdot {formatN(obj.q.x)} + {formatN(obj.q.y)} \\cdot {formatN(obj.q.z)}), 1 - 2({formatN(obj.q.x)}^2 + {formatN(obj.q.y)}^2))\n = {formatN(roll)} \; rad = {formatN(degrees(roll))}^\circ  \]\n"
            f"\[\n \\text{{pitch}}\\,(Y) = \\theta = \\arcsin(2({formatN(obj.q.w)} \\cdot {formatN(obj.q.y)} - {formatN(obj.q.z)} \\cdot {formatN(obj.q.x)}))\n = {formatN(pitch)} \; rad = {formatN(degrees(pitch))}^\circ \]\n"
            f"\[\n \\text{{yaw}}\\,(Z) = \\psi = \\arctan2(2({formatN(obj.q.w)} \\cdot {formatN(obj.q.z)} + {formatN(obj.q.x)} \\cdot {formatN(obj.q.y)}), 1 - 2({formatN(obj.q.y)}^2 + {formatN(obj.q.z)}^2))\n = {formatN(yaw)} \; rad = {formatN(degrees(yaw))}^\circ \]\n"
        ))


    def homo_matrices_definition(self):
        pass
    
    def get_content(self):
        return "\n".join(self.content)
    
    def build_tex(self, filename="objects.tex"):
        block = (
            "\\documentclass[16pt]{article}\n"
            "% Codificación y márgenes\n"
            "\\usepackage[utf8]{inputenc}\n"
            "\\usepackage[margin=1in]{geometry}\n"
            "\\usepackage{fancyhdr}\n"
            "\\usepackage{amsmath, amssymb}\n"
            "% Fuentes y espaciado\n"
            "\\usepackage{setspace}\n"
            "\\doublespacing\n"
            "\\usepackage{times}\n"
            "\\usepackage{parskip}\n"
            "%\\setlength{\\parindent}{1.27cm}\n"
            "% Encabezado APA\n"
            "\\pagestyle{fancy}\n"
            "\\fancyhead[L]{\\shorttitle}\n"
            "\\fancyhead[R]{\\thepage}\n"
        )

        with open(filename, "w", encoding="utf-8") as f:
            f.write(block)
            f.write(self.get_content())
            f.write("\\end{document}\n")
        return filename

    
    def build_pdf(self, tex_file:str):
        self.build_tex(tex_file+".tex")
        tex_path = Path(tex_file).with_suffix(".tex").resolve()
        subprocess.run( ["pdflatex", "-interaction=nonstopmode", str(tex_path)], check=True )


def formatN(num: float, n: int = 4) -> str:
    num_redondeado = round(num, n)
    if abs(num_redondeado) < 10**(-n):
        num_redondeado = 0.0
    s = f"{num_redondeado:.{n}f}"
    s = s.rstrip('0').rstrip('.')
    return s


