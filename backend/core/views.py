from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django.http import FileResponse
import os
from math import radians
import uuid
import shutil
from pathlib import Path

from .serializers import ScenePostSerializer

from .quaternions.object import QObject
from .quaternions.quaternion import Quaternion
from .quaternions.coords import Coords
from .doc_builder.LatexDoc import LatexDoc


class SceneProcedures_View(APIView):
    def post(self, request):
        serializer = ScenePostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        objects = data["objects"]

        doc = LatexDoc()
        processed_data = {}
        index = 0

        for object_id, obj in objects.items():
            index +=1
            
            if data["method"] == "quaternions":
                doc.QObject_definition()
                QObj = QObject(
                    float(obj["position"]["x"]),
                    float(obj["position"]["y"]),
                    float(obj["position"]["z"]),
                    Quaternion(1, 0, 0, 0),
                    name = obj["name"],
                    key=str(index),
                    doc= doc
                )

                
                if float(obj["orientation"]["x"]) != 0:
                    QObj.rotate_x(radians(float(obj["orientation"]["x"])))
                if float(obj["orientation"]["y"]) != 0:
                    QObj.rotate_y(radians(float(obj["orientation"]["y"])))
                if float(obj["orientation"]["z"]) != 0:
                    QObj.rotate_z(radians(float(obj["orientation"]["z"])))


                for transf in obj["transformations"]:
                    
                    if transf["type"] == "translation":
                        translation = Coords(float(transf["x"]), float(transf["y"]), float(transf["z"]))
                        QObj.translate(translation)
                    
                    elif transf["type"] == "rotation":
                        if float(transf["x"]) != 0:
                            QObj.rotate_x(radians(float(transf["x"])))
                        if float(transf["y"]) != 0:
                            QObj.rotate_y(radians(float(transf["y"])))
                        if float(transf["z"]) != 0:
                            QObj.rotate_z(radians(float(transf["z"])))

                # Convertir Coords a dict para que sea JSON serializable
                processed_data[object_id] = {
                    "coords": {"x": round(QObj.coords.x, 4), "y": round(QObj.coords.y, 4), "z": round(QObj.coords.z, 4) },
                    "Q": {
                        "x": round(QObj.q.x, 4),
                        "y": round(QObj.q.y, 4),
                        "z": round(QObj.q.z, 4),
                        "w": round(QObj.q.w, 4)
                    }
                }
                QObj.doc_finalvalues()
                
                
            elif data["method"] == "matrixes":
                pass
            else:
                return Response({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        unique_id = uuid.uuid4()

        tmp_dir = Path("/app/tmp")
        tmp_dir.mkdir(exist_ok=True)

        # Clean tmp
        for file in tmp_dir.glob("*"):
            try:
                file.unlink()
            except Exception:
                pass

        # Generate file
        if(data["doc"] == "pdf"):
            pdf_filename = tmp_dir / f"scene_{unique_id}.pdf"        
            doc.build_pdf(str(pdf_filename).replace(".pdf",""))
            response = FileResponse(open(pdf_filename, "rb"), as_attachment=True, filename="scene.pdf")
            return response
        
        elif(data["doc"] == "latex"):
            tex_filename = tmp_dir / f"scene_{unique_id}.tex"        
            doc.build_tex(str(tex_filename))
            response = FileResponse(open(tex_filename, "rb"), as_attachment=True, filename="scene.pdf")
            return response
        
        else:
            return Response({}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            