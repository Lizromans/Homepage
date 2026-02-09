from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.db import models
import os
from django.utils import timezone
from datetime import timedelta

class AdminManager(BaseUserManager):
    """Manager personalizado para el modelo Admin"""
    
    def create_user(self, username, email, password=None):
        """Crear un usuario normal"""
        if not username:
            raise ValueError('El usuario debe tener un username')
        if not email:
            raise ValueError('El usuario debe tener un email')
        
        user = self.model(
            username=username,
            email=self.normalize_email(email)
        )
        user.set_password(password)  # ✅ Usa el método de AbstractBaseUser
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, email, password=None):
        """Crear un superusuario"""
        user = self.create_user(
            username=username,
            email=email,
            password=password
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class Admin(AbstractBaseUser, PermissionsMixin):
    """Modelo de Admin personalizado compatible con Django Authentication"""
    
    id_admin = models.AutoField(primary_key=True)
    username = models.CharField(max_length=250, unique=True)
    email = models.EmailField(unique=True)
    
    # Campos requeridos por Django
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    # Configuración de AbstractBaseUser
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']
    
    objects = AdminManager()
 
    groups = models.ManyToManyField(
        Group,
        through='AdminGrupos',
        related_name='admin_users',  # Cambiado para evitar conflictos
        blank=True,
        help_text='Los grupos a los que pertenece este usuario.'
    )
    
    user_permissions = models.ManyToManyField(
        Permission,
        through='AdminUserPermissions',
        related_name='admin_users_permissions',  # Cambiado para evitar conflictos
        blank=True,
        help_text='Permisos específicos para este usuario.'
    )
    
    class Meta:
        managed = True
        db_table = "admin"
        verbose_name = "Administrador de Catálogo"
        verbose_name_plural = "Administradores de Catálogo"
    
    def __str__(self):
        return self.username
    
    def has_perm(self, perm, obj=None):
        """¿El usuario tiene un permiso específico?"""
        return True
    
    def has_module_perms(self, app_label):
        """¿El usuario tiene permisos para ver la app?"""
        return True


class AdminGrupos(models.Model):
    """Tabla intermedia para la relación Admin-Groups"""
    id = models.AutoField(primary_key=True)
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE, db_column='id_admin')
    grupo = models.ForeignKey(Group, on_delete=models.CASCADE, db_column='group_id')

    class Meta:
        managed = True
        db_table = 'admin_grupos'
        unique_together = ('admin', 'grupo')
        verbose_name = "Grupo de Admin"
        verbose_name_plural = "Grupos de Admin"
    
    def __str__(self):
        return f"{self.admin.username} - {self.grupo.name}"


class AdminUserPermissions(models.Model):
    """Tabla intermedia para la relación Admin-Permissions"""
    id = models.AutoField(primary_key=True)
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE, db_column='id_admin')
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, db_column='permission_id')

    class Meta:
        managed = True
        db_table = 'admin_user_permissions'
        unique_together = ('admin', 'permission')
        verbose_name = "Permiso de Admin"
        verbose_name_plural = "Permisos de Admin"
    
    def __str__(self):
        return f"{self.admin.username} - {self.permission.codename}"


class Solucion(models.Model):
    """Modelo para las soluciones del catálogo"""
    
    id = models.AutoField(primary_key=True)
    
    CATEGORIAS = [
        ('innovacion', 'Innovación'),
        ('investigacion', 'Investigación'),
        ('academico', 'Académico'),
    ]
    
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    
    # Campos para iconos/imágenes
    tipo_icono = models.CharField(
        max_length=10,
        choices=[('svg', 'Icono SVG'), ('imagen', 'Imagen PNG')],
        default='svg'
    )
    
    icono_nombre = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Nombre del icono SVG (ej: rocket, lightbulb, flask)"
    )
    
    icono_imagen = models.ImageField(
        upload_to="iconos/",
        blank=True,
        null=True,
        help_text="Archivo PNG para el icono (máx 2MB)"
    )
    
    categoria = models.CharField(max_length=100, choices=CATEGORIAS)
    url = models.URLField(max_length=200)
    
    id_admin = models.ForeignKey(
        Admin,
        on_delete=models.CASCADE,
        related_name="soluciones",
        db_column='id_admin'
    )
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        managed = True
        db_table = 'solucion'
        verbose_name = "Solución"
        verbose_name_plural = "Soluciones"
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return self.titulo
    
    def get_icono_display(self):

        if self.tipo_icono == 'svg':
            return {
                'tipo': 'svg',
                'valor': self.icono_nombre or 'rocket'
            }
        else:
            return {
                'tipo': 'imagen',
                'valor': self.icono_imagen.url if self.icono_imagen else None
            }

    def es_nueva(self):
        return self.fecha_creacion >= timezone.now() - timedelta(days=7)
    
    def delete(self, *args, **kwargs):
        if self.icono_imagen and self.icono_imagen.name:
            if os.path.isfile(self.icono_imagen.path):
                os.remove(self.icono_imagen.path)

        self.icono_imagen = None
        self.icono_nombre = None
        self.tipo_icono = None

        super().delete(*args, **kwargs)
    
    def clean(self):

        from django.core.exceptions import ValidationError
        
        if self.tipo_icono == 'svg' and not self.icono_nombre:
            raise ValidationError('Debe proporcionar un nombre de icono SVG')
        
        if self.tipo_icono == 'imagen' and not self.icono_imagen:
            raise ValidationError('Debe proporcionar una imagen PNG')