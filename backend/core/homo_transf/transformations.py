from numpy import array, ndarray
from math import cos, sin, radians


def homo_transform_translation(x: float, y:float, z:float):
    return array([
        [1, 0, 0, x],
        [0, 1, 0, y],
        [0, 0, 1, z],
        [0, 0, 0, 1]
    ])

# Homogeneous_transformation
def homo_transform_rotation(angle:float ,x:bool=False, y:bool=False, z:bool=False):
    angle = radians(angle)
    
    if x:
        return array([
            [1, 0, 0],
            [0, cos(angle), -sin(angle)],
            [0, sin(angle), cos(angle)]
        ])

    elif y:
        return array([
            [cos(angle), 0, sin(angle)],
            [0, 1, 0],
            [-sin(angle), 0, cos(angle)]
            ])
        
    elif z:
        return array([
            [cos(angle), -sin(angle), 0],
            [sin(angle), cos(angle), 0],
            [0, 0, 1]
        ])
        
    return None

def homo_transform(translation_vector:ndarray, angle:float ,x:bool=False, y:bool=False, z:bool=False):
    angle = radians(angle)
    px, py, pz = translation_vector
    
    if x:
        return array([
            [1, 0, 0, px],
            [0, cos(angle), -sin(angle), py],
            [0, sin(angle), cos(angle), pz]
            [0, 0, 0, 1]
        ])

    elif y:
        return array([
            [cos(angle), 0, sin(angle), px],
            [0, 1, 0, py],
            [-sin(angle), 0, cos(angle), pz],
            [0, 0, 0, 1]            
            ])
        
    elif z:
        return array([
            [cos(angle), -sin(angle), 0, px],
            [sin(angle), cos(angle), 0, py],
            [0, 0, 1, pz],
            [0, 0, 0, 1]
        ])
        
    return None