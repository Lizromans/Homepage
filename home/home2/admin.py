from django.contrib import admin
from .models import Admin, AdminGrupos

# Register your models here.
class AdminGruposInline(admin.TabularInline):
    model = AdminGrupos
    extra = 1

class AdminAdmin(admin.ModelAdmin):
    list_display = ("id_admin", "username", "email", "password")
    inlines = [AdminGruposInline] 

admin.site.register(Admin, AdminAdmin)