from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser
import uuid

class CustomUserManager(BaseUserManager):
    def create_user(self,email,password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self,email,password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)
    

class CustomUser(AbstractUser):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role_choices = [
        ('admin', 'Admin'),
        ('user', 'User'),
        ('therapist', 'Therapist'),
    ]
    username = None
    first_name = models.CharField(max_length=30, blank=False)
    last_name = models.CharField(max_length=30, blank=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=role_choices, default='user')
    
    therapist = models.ForeignKey(
    "self",
    null=True,
    blank=True,
    on_delete=models.SET_NULL,
    related_name="patients"
)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    class Meta:
        unique_together = ('email','role','first_name','last_name')
    
    objects = CustomUserManager()

    def __str__(self):
        return self.email