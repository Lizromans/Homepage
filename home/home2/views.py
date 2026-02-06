import os
import json
import logging

from django.shortcuts import render, redirect
from django.contrib import messages
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.paginator import Paginator
from django.core.files.storage import default_storage

from .models import Admin, Solucion

logger = logging.getLogger(__name__)


# VISTA BIENVENIDO
def bienvenido(request):
    """Vista principal que muestra el catálogo de soluciones"""
    soluciones = Solucion.objects.all().order_by('-id')
    
    paginator = Paginator(soluciones, 4)
    page_number = request.GET.get('page')
    soluciones_paginadas = paginator.get_page(page_number)

    total_soluciones = Solucion.objects.count() + 6
    
    context = {
        'soluciones_paginadas': soluciones_paginadas,
        'total_soluciones': total_soluciones,
    }
    
    return render(request, 'bienvenido.html', context)


# VISTAS DE CATÁLOGO DE SOLUCIONES
def login_catalogo(request):
    """Vista de login para el admin del catálogo"""
    # Si ya está autenticado, redirigir al editor
    if request.session.get('catalogo_admin_id'):
        return redirect('bienvenido')  # ✅ Corregido: usar nombre de URL, no archivo
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        try:
            admin = Admin.objects.get(username=username)
            
            if admin.check_password(password):
                # Guardar en sesión
                request.session['catalogo_admin_id'] = admin.id_admin
                request.session['catalogo_admin_username'] = admin.username
                
                messages.success(request, f'¡Bienvenido {admin.username}!')
                return redirect('bienvenido')
            else:
                messages.error(request, 'Contraseña incorrecta')
        except Admin.DoesNotExist:
            messages.error(request, 'Usuario no encontrado')
    
    return render(request, 'bienvenido.html')


def logout_catalogo(request):
    """Cerrar sesión del admin del catálogo"""
    request.session.flush()
    messages.success(request, 'Sesión cerrada exitosamente')
    return redirect('bienvenido')


def editar_catalogo(request):
    """Vista para editar el catálogo - requiere autenticación"""
    # Verificar si está autenticado
    if not request.session.get('catalogo_admin_id'):
        messages.warning(request, 'Debes iniciar sesión primero')
        return redirect('bienvenido') 
    
    # Obtener el admin actual
    try:
        admin = Admin.objects.get(id_admin=request.session['catalogo_admin_id'])
    except Admin.DoesNotExist:
        request.session.flush()
        return redirect('bienvenido') 
    
    # Ruta del archivo HTML
    file_path = os.path.join(settings.BASE_DIR, 'templates', 'bienvenido.html')
    
    if request.method == 'POST':
        contenido = request.POST.get('contenido')
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(contenido)
            messages.success(request, '¡Catálogo guardado exitosamente!')
        except Exception as e:
            messages.error(request, f'Error al guardar: {str(e)}')
        
        return redirect('bienvenido')  
    
    # Leer el contenido actual
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            contenido = f.read()
    except FileNotFoundError:
        contenido = '<!-- Archivo no encontrado, crea tu contenido aquí -->'
    
    return render(request, 'bienvenido.html', {
        'contenido': contenido,
        'admin': admin
    })


@csrf_exempt
@require_http_methods(["POST"])
def agregar_solucion(request):
    """
    Vista para agregar una nueva solución al catálogo.
    Soporta tanto iconos SVG (por nombre) como imágenes PNG (upload).
    """
    try:
        # ============================================================
        # 1. VALIDACIÓN DE AUTENTICACIÓN
        # ============================================================
        admin_id = request.session.get('catalogo_admin_id')
        if not admin_id:
            return JsonResponse({
                'success': False,
                'error': 'No estás autenticado como administrador'
            }, status=403)
        
        # Verificar que el admin existe
        try:
            admin = Admin.objects.get(id_admin=admin_id)
        except Admin.DoesNotExist:
            logger.error(f'Admin con id {admin_id} no encontrado')
            return JsonResponse({
                'success': False,
                'error': 'Administrador no encontrado'
            }, status=404)
        
        # ============================================================
        # 2. OBTENCIÓN DE DATOS DEL FORMULARIO
        # ============================================================
        titulo = request.POST.get('titulo', '').strip()
        descripcion = request.POST.get('descripcion', '').strip()
        categoria = request.POST.get('categoria', '').strip()
        url = request.POST.get('url', '').strip()
        tipo_imagen = request.POST.get('tipo_imagen', 'icon').strip()
        
        logger.info(f"📝 Datos recibidos para nueva solución:")
        logger.info(f"   - titulo: {titulo}")
        logger.info(f"   - categoria: {categoria}")
        logger.info(f"   - tipo_imagen: {tipo_imagen}")
        
        # ============================================================
        # 3. VALIDACIÓN DE CAMPOS OBLIGATORIOS
        # ============================================================
        if not titulo:
            return JsonResponse({
                'success': False,
                'error': 'El título es requerido'
            }, status=400)
        
        if len(titulo) > 200:
            return JsonResponse({
                'success': False,
                'error': 'El título no puede exceder 200 caracteres'
            }, status=400)
        
        if not descripcion:
            return JsonResponse({
                'success': False,
                'error': 'La descripción es requerida'
            }, status=400)
        
        if not categoria or categoria not in ['innovacion', 'investigacion', 'academico']:
            return JsonResponse({
                'success': False,
                'error': 'Categoría inválida. Debe ser: innovacion, investigacion o academico'
            }, status=400)
        
        if not url:
            return JsonResponse({
                'success': False,
                'error': 'La URL es requerida'
            }, status=400)
        
        if len(url) > 200:
            return JsonResponse({
                'success': False,
                'error': 'La URL no puede exceder 200 caracteres'
            }, status=400)
        
        # Validar formato básico de URL
        if not url.startswith(('http://', 'https://')):
            return JsonResponse({
                'success': False,
                'error': 'La URL debe comenzar con http:// o https://'
            }, status=400)
        
        # ============================================================
        # 4. MANEJO DE ICONO/IMAGEN
        # ============================================================
        if tipo_imagen == 'image':
            # ========== MANEJO DE IMAGEN PNG ==========
            if 'icono' not in request.FILES:
                return JsonResponse({
                    'success': False,
                    'error': 'Debe subir una imagen PNG'
                }, status=400)
            
            imagen = request.FILES['icono']
            
            # Validar tipo de archivo
            if not imagen.name.lower().endswith('.png'):
                return JsonResponse({
                    'success': False,
                    'error': 'Solo se permiten archivos PNG'
                }, status=400)
            
            # Validar tamaño (máximo 2MB)
            if imagen.size > 2 * 1024 * 1024:
                return JsonResponse({
                    'success': False,
                    'error': 'El archivo no debe superar 2MB'
                }, status=400)
            
            logger.info(f"🖼️ Imagen recibida: {imagen.name} ({imagen.size} bytes)")
            
            # Crear solución con imagen PNG
            nueva_solucion = Solucion(
                titulo=titulo,
                descripcion=descripcion,
                categoria=categoria,
                url=url,
                tipo_icono='imagen',
                icono_imagen=imagen,
                id_admin=admin
            )
            nueva_solucion.save()
            
            logger.info(f"✅ Solución guardada con imagen: ID {nueva_solucion.id}")
            
            return JsonResponse({
                'success': True,
                'message': 'Solución agregada exitosamente con imagen',
                'solucion': {
                    'id': nueva_solucion.id,
                    'titulo': nueva_solucion.titulo,
                    'descripcion': nueva_solucion.descripcion,
                    'categoria': nueva_solucion.categoria,
                    'url': nueva_solucion.url,
                    'tipo_icono': nueva_solucion.tipo_icono,
                    'icono_imagen_url': nueva_solucion.icono_imagen.url
                }
            })
            
        else:
            # ========== MANEJO DE ICONO SVG ==========
            icono_nombre = request.POST.get('icono_nombre', '').strip()
            
            logger.info(f"🎨 Icono SVG seleccionado: {icono_nombre}")
            
            if not icono_nombre:
                return JsonResponse({
                    'success': False,
                    'error': 'Debe seleccionar un icono'
                }, status=400)
            
            # Lista de iconos válidos
            iconos_validos = [
                'rocket', 'lightbulb', 'flask', 'graduation-cap',
                'chart-line', 'users', 'book-open', 'microscope',
                'brain', 'atom', 'dna', 'laptop-code'
            ]
            
            if icono_nombre not in iconos_validos:
                return JsonResponse({
                    'success': False,
                    'error': f'Icono no válido. Debe ser uno de: {", ".join(iconos_validos)}'
                }, status=400)
            
            # Crear solución con icono SVG
            nueva_solucion = Solucion(
                titulo=titulo,
                descripcion=descripcion,
                categoria=categoria,
                url=url,
                tipo_icono='svg',
                icono_nombre=icono_nombre,
                id_admin=admin
            )
            nueva_solucion.save()
            
            logger.info(f"✅ Solución guardada con icono SVG: ID {nueva_solucion.id}")
            
            return JsonResponse({
                'success': True,
                'message': 'Solución agregada exitosamente con icono',
                'solucion': {
                    'id': nueva_solucion.id,
                    'titulo': nueva_solucion.titulo,
                    'descripcion': nueva_solucion.descripcion,
                    'categoria': nueva_solucion.categoria,
                    'url': nueva_solucion.url,
                    'tipo_icono': nueva_solucion.tipo_icono,
                    'icono_nombre': nueva_solucion.icono_nombre
                }
            })
        
    except Exception as e:
        logger.error(f'Error al agregar solución: {str(e)}', exc_info=True)
        return JsonResponse({
            'success': False,
            'error': 'Error al procesar la solicitud'
        }, status=500)


@csrf_exempt
@require_http_methods(["POST", "PUT"])
def editar_solucion(request, solucion_id):
    """Vista para editar una solución existente"""
    try:
        # Validar autenticación
        admin_id = request.session.get('catalogo_admin_id')
        if not admin_id:
            return JsonResponse({
                'success': False,
                'error': 'No estás autenticado como administrador'
            }, status=403)
        
        # Obtener la solución
        try:
            solucion = Solucion.objects.get(id=solucion_id)
        except Solucion.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Solución no encontrada'
            }, status=404)
        
        # Verificar permisos
        if solucion.id_admin.id_admin != admin_id:
            return JsonResponse({
                'success': False,
                'error': 'No tienes permisos para editar esta solución'
            }, status=403)
        
        # Actualizar campos si se proporcionan
        if 'titulo' in request.POST:
            titulo = request.POST.get('titulo', '').strip()
            if titulo:
                solucion.titulo = titulo
        
        if 'descripcion' in request.POST:
            descripcion = request.POST.get('descripcion', '').strip()
            if descripcion:
                solucion.descripcion = descripcion
        
        if 'categoria' in request.POST:
            categoria = request.POST.get('categoria', '').strip()
            if categoria in ['innovacion', 'investigacion', 'academico']:
                solucion.categoria = categoria
        
        if 'url' in request.POST:
            url = request.POST.get('url', '').strip()
            if url and url.startswith(('http://', 'https://')):
                solucion.url = url
        
        # ✅ CORREGIDO: Actualizar icono/imagen correctamente
        tipo_imagen = request.POST.get('tipo_imagen')
        if tipo_imagen == 'image' and 'icono' in request.FILES:
            imagen = request.FILES['icono']
            if imagen.name.lower().endswith('.png') and imagen.size <= 2 * 1024 * 1024:
                solucion.icono_imagen = imagen  # ✅ Campo correcto
                solucion.tipo_icono = 'imagen'
        elif tipo_imagen == 'icon':
            icono_nombre = request.POST.get('icono_nombre', '').strip()
            if icono_nombre:
                solucion.icono_nombre = icono_nombre  # ✅ Campo correcto
                solucion.tipo_icono = 'svg'
        
        solucion.save()
        
        logger.info(f'Solución {solucion_id} actualizada por admin {admin_id}')
        
        # ✅ CORREGIDO: Respuesta con campos correctos
        return JsonResponse({
            'success': True,
            'message': 'Solución actualizada exitosamente',
            'solucion': {
                'id': solucion.id,
                'titulo': solucion.titulo,
                'descripcion': solucion.descripcion,
                'tipo_icono': solucion.tipo_icono,
                'icono_nombre': solucion.icono_nombre,
                'icono_imagen_url': solucion.icono_imagen.url if solucion.icono_imagen else None,
                'categoria': solucion.categoria,
                'url': solucion.url
            }
        })
        
    except Exception as e:
        logger.error(f'Error al editar solución {solucion_id}: {str(e)}', exc_info=True)
        return JsonResponse({
            'success': False,
            'error': 'Error al actualizar la solución'
        }, status=500)


@require_http_methods(["DELETE", "POST"])
def eliminar_solucion(request, solucion_id):
    """Vista para eliminar una solución"""
    try:
        # Validar autenticación
        admin_id = request.session.get('catalogo_admin_id')
        if not admin_id:
            return JsonResponse({
                'success': False,
                'error': 'No estás autenticado como administrador'
            }, status=403)
        
        # Obtener la solución
        try:
            solucion = Solucion.objects.get(id=solucion_id)
        except Solucion.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Solución no encontrada'
            }, status=404)
        
        # Verificar permisos
        if solucion.id_admin.id_admin != admin_id:
            return JsonResponse({
                'success': False,
                'error': 'No tienes permisos para eliminar esta solución'
            }, status=403)
        
        # Guardar información antes de eliminar
        titulo = solucion.titulo
        
        # ✅ CORREGIDO: Eliminar archivo de imagen si existe
        if solucion.icono_imagen and hasattr(solucion.icono_imagen, 'path'):
            try:
                if default_storage.exists(solucion.icono_imagen.name):
                    default_storage.delete(solucion.icono_imagen.name)
            except Exception as e:
                logger.warning(f'No se pudo eliminar el archivo de imagen: {str(e)}')
        
        # Eliminar la solución
        solucion.delete()
        
        logger.info(f'Solución "{titulo}" (ID: {solucion_id}) eliminada por admin {admin_id}')
        
        return JsonResponse({
            'success': True,
            'message': 'Solución eliminada exitosamente'
        })
        
    except Exception as e:
        logger.error(f'Error al eliminar solución {solucion_id}: {str(e)}', exc_info=True)
        return JsonResponse({
            'success': False,
            'error': 'Error al eliminar la solución'
        }, status=500)