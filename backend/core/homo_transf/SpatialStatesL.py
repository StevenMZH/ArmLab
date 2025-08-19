from numpy import array, dot
from math import cos, sin, radians
from math import cos, sin, pi
from sympy import symbols, Matrix, cos, sin
from sympy import latex, pi, sympify
import re

class SpatialStatesL:
    def __init__(self, x, y, z):
        self.init = array([[x], [y], [z], [1]])
        self.states = array([  # matriz identidad 4x4
            [1, 0, 0, 0], 
            [0, 1, 0, 0], 
            [0, 0, 1, 0], 
            [0, 0, 0, 1]
        ])
        self.steps = []
        
    def translate(self, x, y, z):
        T = array([
            [1, 0, 0, x],
            [0, 1, 0, y],
            [0, 0, 1, z],
            [0, 0, 0, 1]
        ])
        self.states = dot(T, self.states)
        
    def orientate(self, angle: float, x=False, y=False, z=False):
        angle = radians(angle)

        if x:
            R = array([
                [1, 0, 0, 0],
                [0, cos(angle), -sin(angle), 0],
                [0, sin(angle), cos(angle), 0],
                [0, 0, 0, 1]
            ])
        elif y:
            R = array([
                [cos(angle), 0, sin(angle), 0],
                [0, 1, 0, 0],
                [-sin(angle), 0, cos(angle), 0],
                [0, 0, 0, 1]
            ])
        elif z:
            R = array([
                [cos(angle), -sin(angle), 0, 0],
                [sin(angle), cos(angle), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ])
        else:
            return

        self.states = dot(R, self.states)
        
    def position(self):
        pos = dot(self.states, self.init)
        return pos

    def latex_position(self, var:str = ''):
        position = self.__matrix_to_latex(self.position())
        
        if (var!= ''):
           var = f"{var} = "
        return f"\[{var}{position}\]"

    def latex_translate(self, var, x:float, y:float, z:float, result=True):
        def homo_transf_translate_latex(x: float, y: float, z: float) -> str:
            M = [
                ['1', '0', '0', f'{x}'],
                ['0', '1', '0', f'{y}'],
                ['0', '0', '1', f'{z}'],
                ['0', '0', '0', '1']
            ]

            latex_str = "\\begin{bmatrix}\n"
            latex_str += " \\\\\n".join([" & ".join(row) for row in M])
            latex_str += "\n\\end{bmatrix}"
            return latex_str

        init = self.__matrix_to_latex(self.position())
        mult = homo_transf_translate_latex(x, y, z)
        self.translate(x, y, z)
        
        r = ''
        if result:
            r = " = " + self.__matrix_to_latex(self.position())

        if (var!= ''):
            var = f"{var} = "

        return f"\[{var}{mult} * {init}{r}\]"

    
    def latex_orientate(self, angle: float, var:str, x=False, y=False, z=False, result:bool=False):
        def homo_transf_orientate_latex(angle: float, axis: str = 'z') -> str:
            angle_str = f"{angle}^\\circ"

            if axis == 'x':
                M = [
                    ['1', '0', '0', '0'],
                    ['0', f'\\cos({angle_str})', f'-\\sin({angle_str})', '0'],
                    ['0', f'\\sin({angle_str})',  f'\\cos({angle_str})', '0'],
                    ['0', '0', '0', '1']
                ]
            elif axis == 'y':
                M = [
                    [f'\\cos({angle_str})', '0', f'\\sin({angle_str})', '0'],
                    ['0', '1', '0', '0'],
                    [f'-\\sin({angle_str})', '0', f'\\cos({angle_str})', '0'],
                    ['0', '0', '0', '1']
                ]
            elif axis == 'z':
                M = [
                    [f'\\cos({angle_str})', f'-\\sin({angle_str})', '0', '0'],
                    [f'\\sin({angle_str})', f'\\cos({angle_str})',  '0', '0'],
                    ['0', '0', '1', '0'],
                    ['0', '0', '0', '1']
                ]
            else:
                raise ValueError("Axis debe ser 'x', 'y' o 'z'")

            latex_str = "\\begin{bmatrix}\n"
            latex_str += " \\\\\n".join([" & ".join(row) for row in M])
            latex_str += "\n\\end{bmatrix}"
            return latex_str

        axis = "x" if x else "y" if y else "z" if z else ""
        var = var + " = "

        init = self.__matrix_to_latex(self.position())
        mult = homo_transf_orientate_latex(angle, axis)
        self.orientate(angle,x, y, z)
        
        r = ''
        if result:
            r = " = " + self.__matrix_to_latex(self.position())

        return f"\[{var}{mult} * {init}{r}\]"


    def __matrix_to_latex(self, matrix):
        def num_parser(valor):
            return ('{:.4f}'.format(valor)).rstrip('0').rstrip('.') if '.' in '{:.4f}'.format(valor) else str(valor)

        rows = [" & ".join([f"{num_parser(element)}" for element in row]) for row in matrix]
        body = " \\\\\n".join(rows)
        
        return f"\\begin{{bmatrix}}\n{body}\n\\end{{bmatrix}}"
    



def DH_symbolic(states, t_values: list, var: str = '', result: bool = True):
    """
    Aplica el algoritmo de Denavit-Hartenberg de manera simbólica usando sympy.
    t_values: lista de parámetros DH [[O_i, d_i, a_i, A_i], ...] (pueden ser strings o símbolos)
    var: nombre de la variable para la documentación en LaTeX
    result: si True, muestra el resultado final en LaTeX
    """

    latex_steps = []
    T_total = Matrix.eye(4)
    latex_process = []
    
    dh_table = "\\[\n\\begin{array}{c|c|c|c|c}\n"
    dh_table += "i & \\theta_i & d_i & a_i & \\alpha_i \\\\\n\\hline\n"
    for idx, values in enumerate(t_values):
        O_i, d_i, a_i, A_i = values
        # Mostrar como string para LaTeX
        row = f"{idx+1} & {latex(O_i)} & {latex(d_i)} & {latex(a_i)} & {latex(A_i)} \\\\"
        dh_table += row + "\n"
    dh_table += "\\end{array}\n\\]\n"

    latex_blocks = [dh_table]

    for idx, values in enumerate(t_values):
        O_i, d_i, a_i, A_i = values

        # Convertir a símbolos si son strings
        if isinstance(O_i, str): O_i = sympify(O_i)
        if isinstance(d_i, str): d_i = sympify(d_i)
        if isinstance(a_i, str): a_i = sympify(a_i)
        if isinstance(A_i, str): A_i = sympify(A_i)

        T = Matrix([
            [cos(O_i), -sin(O_i)*cos(A_i), sin(O_i)*sin(A_i), a_i*cos(O_i)],
            [sin(O_i), cos(O_i)*cos(A_i), -cos(O_i)*sin(A_i), a_i*sin(O_i)],
            [0, sin(A_i), cos(A_i), d_i],
            [0, 0, 0, 1]
        ])
        print(f"\nT_{idx+1} =")
        print(T)
        latex_steps.append(T)
        T_total = T_total * T
        print(f"\nT_total después de T_{idx+1} =")
        print(T_total)

        latex_process.append(
            f"T_{{{idx+1}}} = {latex(T)}"
        )

    # Multiplicar por el estado inicial si es un objeto SpatialStates
    if hasattr(states, 'init'):
        result_vec = T_total * Matrix(states.init)
        init_vec = Matrix(states.init)
    else:
        result_vec = T_total * Matrix(states)
        init_vec = Matrix(states)

    # Construir el proceso en LaTeX, cada paso en su propio bloque
    for step in latex_process:
        latex_blocks.append(f"\\[\n{step}\n\\]")

    latex_chain = " \\cdot ".join([f"T_{{{i+1}}}" for i in range(len(latex_steps))])
    latex_chain_eq = f"{var} = {latex_chain} \\cdot {latex(init_vec)}"
    latex_blocks.append(f"\\[\n{latex_chain_eq}\n\\]")


    if result:
        # Reemplaza \cos y \sin por C y S y elimina paréntesis
        result_latex = latex(result_vec)
        result_latex = re.sub(r'\\cos\{([^}]*)\}', r'C\1', result_latex)
        result_latex = re.sub(r'\\sin\{([^}]*)\}', r'S\1', result_latex)
        result_latex = result_latex.replace(r'\left(', '').replace(r'\right)', '')
        latex_blocks.append(f"\\[\n{var} = {result_latex}\n\\]")


    latex_full = "\n".join(latex_blocks)

    return T_total, result_vec, latex_full



def dh1():
    theta_1, theta_2, theta_3, L1, L2, L3, L4 = symbols('\\theta_1 \\theta_2 \\theta_3 L1 L2 L3 L4')
    init = Matrix([[0], [0], [0], [1]])
    T, pos, latex_out = DH_symbolic(
        init,
        [
            [0, 0, L1, 'pi/2'],
            [theta_1, 0, L2, 0],
            [theta_2, 0, L3, 0],
            [theta_3, 0, L4, 0],
            [0, 0, 0, 0]
        ],
        var="P"
    )
    print("Latex process:")
    print(latex_out)


def dh2():
    q_1, q_2, q_3, L1, L2, L3 = symbols('q_1 q_2 q_3 L1 L2 L3')
    init = Matrix([[0], [0], [0], [1]])
    T, pos, latex_out = DH_symbolic(
        init,
        [
            [0, 0, 0, 'pi/2'],
            [q_1, 0, L1, 0],
            [q_2, 0, L2, 0],
            [q_3, 0, L3, 0],
            [0, 0, 0, 0]
        ],
        var="P"
    )
    print("Latex process:")
    print(latex_out)
    
def dh3():
    theta_1, theta_2, theta_3, L1, L2, L3, L4 = symbols('\\theta_1 \\theta_2 \\theta_3 L1 L2 L3 L4')
    init = Matrix([[0], [0], [0], [1]])
    T, pos, latex_out = DH_symbolic(
        init,
        [
            [0, 0, 0, 'pi/2'],
            [0, L1, 0, 0],
            [theta_1, 0, L2, 0],
            [theta_2, L3, 0, 0],
            [0, L4, 0, "-pi/2"],
            [0, theta_3, 0, "pi/2"],
            [0, 0, 0, 0]
        ],
        var="P"
    )
    print("Latex process:")
    print(latex_out)


if __name__ == "__main__":
    dh1()