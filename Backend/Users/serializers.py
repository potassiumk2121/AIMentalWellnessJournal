from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from .models import CustomUser
from django.contrib.auth import get_user_model

User = get_user_model()

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'password']
        
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user=CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        group,_=Group.objects.get_or_create(name='User')
        user.groups.add(group)
        return user
    

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            email=data['email'],       
            password=data['password']
        )

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_active:
            raise serializers.ValidationError("Account disabled")

        data['user'] = user
        return data

