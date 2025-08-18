from django.urls import path
from .views import SceneProcedures_View

urlpatterns = [
    path('procedure/', SceneProcedures_View.as_view(), name='3D Object Transformation Doc'),
]

