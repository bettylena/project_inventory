from rest_framework import serializers
from inventory.models import Product  # Importa el modelo de la base de datos existente

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'