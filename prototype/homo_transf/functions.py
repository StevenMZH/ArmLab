from numpy import array
from math import radians

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

    
