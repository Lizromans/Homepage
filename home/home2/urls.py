from django.urls import path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    
    path('', views.bienvenido, name='bienvenido'),
    # Catalogo
    path('catalogo/login/', views.login_catalogo, name='login_catalogo'),
    path('catalogo/logout/', views.logout_catalogo, name='logout_catalogo'),

    # API para manejar soluciones
    path('agregar-solucion/', views.agregar_solucion, name='agregar_solucion'),
    path('eliminar-solucion/<int:id>/', views.eliminar_solucion, name='eliminar_solucion'),
    path('editar-solucion/<int:id>/', views.editar_solucion, name='editar_solucion'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)