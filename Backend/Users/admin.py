from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = (
        'id',
        'email',
        'role',
        'therapist',
        'is_staff',
        'is_active',
        'created_at',
        'updated_at'
    )

    search_fields = ('email',)
    ordering = ('email',)

    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'role', 'therapist')}),
        ('Permissions', {
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions'
            )
        }),
        ('Important Dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'first_name',
                'last_name',
                'role',
                'password1',
                'password2',
                'is_staff',
                'is_active'
            ),
        }),
    )

    list_filter = ()

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "therapist":
            kwargs["queryset"] = CustomUser.objects.filter(role="therapist")
        return super().formfield_for_foreignkey(db_field, request, **kwargs)