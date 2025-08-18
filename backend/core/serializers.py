from rest_framework import serializers

# Serializer for vectors (position, orientation)
class VectorSerializer(serializers.Serializer):
    x = serializers.FloatField()
    y = serializers.FloatField()
    z = serializers.FloatField()

# Serializer for quaternions
class QuaternionSerializer(serializers.Serializer):
    x = serializers.FloatField()
    y = serializers.FloatField()
    z = serializers.FloatField()
    w = serializers.FloatField()

# Serializer for transformations
class TransformationSerializer(serializers.Serializer):
    type = serializers.CharField()
    x = serializers.FloatField()
    y = serializers.FloatField()
    z = serializers.FloatField()

# Main serializer for each object
class ObjectSerializer(serializers.Serializer):
    name = serializers.CharField()
    position = VectorSerializer()
    orientation = VectorSerializer()
    frame = serializers.CharField()
    transformations = TransformationSerializer(many=True)

# Serializer for the POST request
class ScenePostSerializer(serializers.Serializer):
    method = serializers.CharField()
    doc = serializers.CharField()
    objects = serializers.DictField(child=ObjectSerializer())
