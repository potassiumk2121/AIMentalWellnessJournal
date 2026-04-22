from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self,request,view):
        return request.user.groups.filter(name='Admin').exists()

class IsTherapist(BasePermission):
    def has_permission(self,request,view):
        return request.user.groups.filter(name='Therapist').exists()

class IsUser(BasePermission):
    def has_permission(self,request,view):
        return request.user.groups.filter(name='User').exists()
    
class IsUserOrTherapistOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(
            name__in=['User', 'Therapist', 'Admin']
        ).exists()