from numpy import array, dot
from SpatialStates import SpatialStates

# Definir matrices

def test():
    P1 = SpatialStates(7, 8, 9)
    print(P1.latex_position("P_1"))

    print(P1.latex_orientate(60, var="P_2 = R_1(z, 60^\circ) * P_1", z=True))
    print(P1.latex_position("P_2"))

    print(P1.latex_translate("P_3 = T_1 * P_1", 5, 7, 3))
    print(P1.latex_position("P_3"))


def Ex1():
    P1 = SpatialStates(2.1, 3.4, 1.8)
    print(P1.latex_position("P_1"))
    
    print(P1.latex_orientate(68, var="P_2 = R_1(z, 68^\circ) * P_1", z=True))
    print(P1.latex_position("P_2"))

    print(P1.latex_translate("P_3 = T_1 * P_2", 5.7, -3.2, 4.1))
    print(P1.latex_position("P_3"))

    print(P1.latex_orientate(45, var="P_4 = R_2(y, 45^\circ) * P_3", y=True))
    print(P1.latex_position("P_4"))

    print(P1.latex_translate("P_5 = T_2 * P_4", -3.5, 4.8, -2.6))
    print(P1.latex_position("P_5"))

    print(P1.latex_orientate(30, var="P_6 = R_3(x, 30^\circ) * P_5", x=True))
    print(P1.latex_position("P_6"))    

def Ex2():
    P1 = SpatialStates(2.4, 3.6, 1.5)
    print(P1.latex_position("P_1"))
    
    print(P1.latex_orientate(25, var="P_2 = R_1(z, 25^\circ) * P_1", z=True))
    print(P1.latex_position("P_2"))

    print(P1.latex_translate("P_3 = T_1 * P_2", 7.1, -3.6, 3.8))

    print(P1.latex_orientate(60, var="P_4 = R_2(y, 60^\circ) * P_3", y=True))
    print(P1.latex_position("P_4"))

    print(P1.latex_translate("P_5 = T_2 * P_4", -4.3, 5.2, -2.9))

    print(P1.latex_orientate(30, var="P_6 = R_3(x, 30^\circ) * P_5", x=True))
    print(P1.latex_position("P_6"))    

def Ex3():
    P1 = SpatialStates(3, 5, 2)
    print(P1.latex_position("P_1"))
    
    print(P1.latex_orientate(60, var="P_2 = R_1(y, 60^\circ) * P_1", y=True))
    print(P1.latex_position("P_2"))

    print(P1.latex_translate("P_3 = T_1 * P_2", 5, -4 ,3))

    print(P1.latex_orientate(30, var="P_4 = R_2(x, 30^\circ) * P_3", x=True))
    print(P1.latex_position("P_4"))

    print(P1.latex_translate("P_5 = T_2 * P_4", -3, 4, -2))

    print(P1.latex_orientate(45, var="P_6 = R_3(z, 45^\circ) * P_5", z=True))
    print(P1.latex_position("P_6"))    

def Ex4():
    P1 = SpatialStates(2, 3, 3)
    print(P1.latex_position("P_1"))
    
    print(P1.latex_orientate(45, var="P_2 = R_1(x, 45^\circ) * P_1", x=True))
    print(P1.latex_position("P_2"))

    print(P1.latex_translate("P_3 = T_1 * P_2",6, -3, 4))

    print(P1.latex_orientate(90, var="P_4 = R_2(z, 90^\circ) * P_3", z=True))
    print(P1.latex_position("P_4"))

    print(P1.latex_translate("P_5 = T_2 * P_4", -3, 4, -3))

    print(P1.latex_orientate(15, var="P_6 = R_3(y, 15^\circ) * P_5", y=True))
    print(P1.latex_position("P_6"))    

def Ex5():
    P1 = SpatialStates(2, 3, 2)
    print(P1.latex_position("P_1"))
    
    print(P1.latex_orientate(30, var="P_2 = R_1(x, 30^\circ) * P_1", x=True))
    print(P1.latex_position("P_2"))

    print(P1.latex_translate("P_3 = T_1 * P_2",5, -3, 4))

    print(P1.latex_orientate(60, var="P_4 = R_2(y, 60^\circ) * P_3", y=True))
    print(P1.latex_position("P_4"))

    print(P1.latex_translate("P_5 = T_2 * P_4", -4, 4, -3))

    print(P1.latex_orientate(45, var="P_6 = R_3(z, 45^\circ) * P_5", z=True))
    print(P1.latex_position("P_6"))    

def Ex6():
    P1 = SpatialStates(2.5, 10, 5)
    print(P1.latex_position("P_1"))
    
    print(P1.latex_translate("P_2 = T_1 * P_1",8.5, -4.3, 3.1))

    print(P1.latex_orientate(45, var="P_3 = R_1(x, 45^\circ) * P_2", x=True))
    print(P1.latex_position("P_2"))

    print(P1.latex_orientate(90, var="P_4 = R_2(z, 90^\circ) * P_3", z=True))
    print(P1.latex_position("P_4"))

    print(P1.latex_translate("P_5 = T_2 * P_4", 7, -2, 5))
    print(P1.latex_position("P_5"))

def EX1():
    P1 = SpatialStates(1, 1, 1)
    print(P1.latex_position("P_1"))
    print(P1.latex_orientate(15, var="P_2 = R_1(z, 15^\circ) * P_1", z=True))
    print(P1.latex_orientate(25, var="P_3 = R_2(x, 25^\circ) * P_2", x=True))
    print(P1.latex_position("P_3"))
    


def EX2():
    P1 = SpatialStates(3, 7, 0)
    print(P1.latex_position("P_1"))
    print(P1.latex_orientate(30, var="P_2 = R_1(z, 30^\circ) * P_1", z=True))
    print(P1.latex_translate("P_3 = T_1 * P_2", 10, 5, 0))    
    print(P1.latex_position("P_3"))

if __name__ == "__main__":
    # EX1()
    EX2()
    