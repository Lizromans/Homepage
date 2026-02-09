(function() {
    'use strict';

    console.log('🚀 Iniciando InnHub - Gestión del Conocimiento...');

    // ========================================================================
    // CONFIGURACIÓN Y CONSTANTES
    // ========================================================================
    
    const CONFIG = {
        MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
        SCROLL_THRESHOLD: 300,
        ANIMATION_DURATION: 2000,
        LOGIN_SCROLL_DELAY: 500
    };

    // ========================================================================
    // CATÁLOGO DE ICONOS SVG
    // ========================================================================
    
    const ICONS_CATALOG = [
        // Comunicación
        { name:"Chat",        cat:"Comunicación",  paths:[{d:"M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z", fill:true}] },
        { name:"Teléfono",    cat:"Comunicación",  paths:[{d:"M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z", fill:true}] },
        { name:"Correo",      cat:"Comunicación",  paths:[{d:"M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z", fill:true}] },
        { name:"Notificación",cat:"Comunicación",  paths:[{d:"M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z", fill:true}] },
        { name:"Anuncio",     cat:"Comunicación",  paths:[{d:"M18 11v2h4v-2h-4zm-2 7.61c3.21 1.51 5.21 2.44 6.39 2.99v-2.21c-1.17-.54-3.17-1.46-6.39-2.98.01.7.0 1.4 0 2.2zM20.4 5.6c-1.18.55-3.18 1.48-6.4 3v2c3.22 1.51 5.22 2.44 6.4 2.99V5.6zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z", fill:true}] },
        
        // Ubicación
        { name:"Ubicación",   cat:"Ubicación",     paths:[{d:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z", fill:true}] },
        { name:"Mapa",        cat:"Ubicación",     paths:[{d:"M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z", fill:true}] },
        { name:"Casa",        cat:"Ubicación",     paths:[{d:"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z", fill:true}] },
        { name:"Edificio",    cat:"Ubicación",     paths:[{d:"M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z", fill:true}] },
        
        // Tiempo
        { name:"Reloj",       cat:"Tiempo",        paths:[{d:"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z", fill:true}] },
        { name:"Calendario",  cat:"Tiempo",        paths:[{d:"M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z", fill:true}] },
        { name:"Alarma",      cat:"Tiempo",        paths:[{d:"M0 3v2h2v14H0v2h24v-2h-2V5h2V3h-24zM5 5h14v14H5V5zm7 2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm-.5 2h1v4.25l3.25 1.94-.5.87L12 14.5V7h-.5z", fill:true}] },
        
        // Herramientas
        { name:"Engranaje",   cat:"Herramientas",  paths:[{d:"M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.488.488 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.61 3.61 0 018.4 12 3.61 3.61 0 0112 8.4a3.61 3.61 0 013.6 3.6 3.61 3.61 0 01-3.6 3.6z", fill:true}] },
        { name:"Herramienta",  cat:"Herramientas", paths:[{d:"M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83-3.21-3.21C11.33.49 10 .36 9.44 1 7.87 2.58 6.27 5.67 8.21 7.62l-1.76 1.77c-.63-.07-2.04.09-3.45 1.5-1.41 1.41-1.25 2.82-1.18 3.45.07.63.81 4.08-2.8 7.56-.34.34-.42.96.13 1.39.37.3.82.44 1.22.44.43 0 .84-.17 1.15-.49 3.48-3.61 4.89-4.83 5.81-3.92 1.41 1.41 1.24 2.82 1.17 3.45 1.44 1.44 3.71 2.26 5.82 2.26 1.65 0 3.08-.52 4.17-1.61 1.95-1.95 1.44-4.62 1.39-5.5 1.95-1.95 1.95-4.98-.01-6.94l1.83-1.84z", fill:true}] },
        { name:"Bombilla",    cat:"Herramientas",  paths:[{d:"M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C7.48 2 3 6.48 3 12c0 3.85 2.25 7.13 5.45 8.7.27.14.55.3.55.58v.02c0 .28-.23.5-.5.5h.3c.41.12.7.5.7.92V23h4v-.78c0-.42.29-.8.7-.92h.3c-.27 0-.5-.22-.5-.5v-.02c0-.28.28-.44.55-.58C18.75 19.13 21 15.85 21 12c0-5.52-4.48-10-10-10z", fill:true}] },
        
        // Desarrollo
        { name:"Código",      cat:"Desarrollo",    paths:[{d:"M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z", fill:true}] },
        { name:"Terminal",    cat:"Desarrollo",    paths:[{d:"M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-9 11l-4-4 4-4v8zm2 0v-8l4 4-4 4z", fill:true}] },
        { name:"Base de datos",cat:"Desarrollo",   paths:[{d:"M12 3c-4.42 0-8 1.79-8 4v2c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 12c-4.42 0-8-1.79-8-4v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4zm0-6c-4.42 0-8-1.79-8-4v3c0 2.21 3.58 4 8 4s8-1.79 8-4V5c0 2.21-3.58 4-8 4z", fill:true}] },
        
        // Negocios
        { name:"Gráfica",     cat:"Negocios",      paths:[{d:"M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z", fill:true}] },
        { name:"Dinero",      cat:"Negocios",      paths:[{d:"M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z", fill:true}] },
        { name:"Maletín",     cat:"Negocios",      paths:[{d:"M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z", fill:true}] },
        
        // Archivos
        { name:"Documento",   cat:"Archivos",      paths:[{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z", fill:true}] },
        { name:"Carpeta",     cat:"Archivos",      paths:[{d:"M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z", fill:true}] },
        { name:"Nube",        cat:"Archivos",      paths:[{d:"M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z", fill:true}] },
        { name:"Descargar",   cat:"Archivos",      paths:[{d:"M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z", fill:true}] },
        
        // Educación
        { name:"Libro",       cat:"Educación",     paths:[{d:"M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z", fill:true}] },
        { name:"Diploma",     cat:"Educación",     paths:[{d:"M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h4l4 3 4-3h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 13H5V6h14v10z", fill:true}] },
        { name:"Graduación",  cat:"Educación",     paths:[{d:"M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z", fill:true}] },
        { name:"Lápiz",       cat:"Educación",     paths:[{d:"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z", fill:true}] },
        
        // Otros
        { name:"Estrella",    cat:"Otros",         paths:[{d:"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z", fill:true}] },
        { name:"Corazón",     cat:"Otros",         paths:[{d:"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z", fill:true}] },
        { name:"Usuario",     cat:"Otros",         paths:[{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", fill:true}] },
        { name:"Buscar",      cat:"Otros",         paths:[{d:"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z", fill:true}] },
        { name:"Candado",     cat:"Otros",         paths:[{d:"M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z", fill:true}] }
    ];

    console.log(`📚 ${ICONS_CATALOG.length} íconos cargados`);

    const categories = ["Todas", ...new Set(ICONS_CATALOG.map(ic => ic.cat))];

    // ========================================================================
    // INICIALIZACIÓN PRINCIPAL
    // ========================================================================
    
    function init() {
        console.log('🔄 Inicializando módulos...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAllModules);
        } else {
            initAllModules();
        }
    }

    function initAllModules() {
        // PRIMERO: Cerrar todos los modales que puedan estar abiertos
        forceCloseAllModalsOnLoad();
        
        // Módulos principales
        initAdminModal();
        initIconCatalog();
        initEditIconCatalogs(); // Inicializar catálogos de edición
        initImageUpload();
        initImageTypeToggle();
        
        // ÚLTIMO: Configurar modales con delay para asegurar que Bootstrap esté listo
        setTimeout(initModalsCorrectly, 100);
        
        console.log('✅ Todos los módulos inicializados');
    }

    // ========================================================================
    // MÓDULO: CERRAR MODALES AL CARGAR
    // ========================================================================
    
    function forceCloseAllModalsOnLoad() {
        console.log('🔒 Cerrando todos los modales al cargar...');
        
        // Cerrar modales de Bootstrap
        const bootstrapModals = document.querySelectorAll('.modal');
        bootstrapModals.forEach(modal => {
            modal.classList.remove('show');
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');
        });
        
        // Cerrar modales personalizados
        const customModals = document.querySelectorAll('.modal-overlay-evento');
        customModals.forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('show');
        });
        
        // Limpiar backdrops
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        
        // Restaurar body
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        console.log('✅ Todos los modales cerrados');
    }

    // ========================================================================
    // MÓDULO: CONFIGURACIÓN CORRECTA DE MODALES
    // ========================================================================
    
    function initModalsCorrectly() {
        console.log('🎭 Inicializando sistema de modales...');
        
        // Verificar que Bootstrap esté cargado
        if (typeof bootstrap === 'undefined') {
            console.warn('⚠️ Bootstrap no está cargado');
            return;
        }
        
        // Configurar botones de ELIMINAR (Bootstrap modals)
        configureDeleteButtons();
        
        // Configurar botones de EDITAR (modales personalizados)
        configureEditButtons();
        
        console.log('✅ Sistema de modales configurado correctamente');
    }

    function configureDeleteButtons() {
        const deleteButtons = document.querySelectorAll('.btn-eliminar[data-bs-toggle="modal"]');
        
        console.log(`🗑️ Configurando ${deleteButtons.length} botones de eliminar`);
        
        deleteButtons.forEach(button => {
            const targetId = button.getAttribute('data-bs-target');
            
            if (!targetId) {
                console.warn('⚠️ Botón sin data-bs-target');
                return;
            }
            
            const targetModal = document.querySelector(targetId);
            
            if (!targetModal) {
                console.warn(`⚠️ Modal no encontrado: ${targetId}`);
                return;
            }
            
            // IMPORTANTE: NO remover los atributos data-bs-*
            // Dejar que Bootstrap los maneje naturalmente
            
            console.log(`✅ Botón de eliminar configurado: ${targetId}`);
        });
    }

    function configureEditButtons() {
        const editButtons = document.querySelectorAll('.btn-editar[data-bs-toggle="modal"]');
        
        console.log(`✏️ Configurando ${editButtons.length} botones de editar`);
        
        editButtons.forEach(button => {
            const targetId = button.getAttribute('data-bs-target');
            
            if (!targetId) {
                console.warn('⚠️ Botón sin data-bs-target');
                return;
            }
            
            const targetModal = document.querySelector(targetId);
            
            if (!targetModal) {
                console.warn(`⚠️ Modal no encontrado: ${targetId}`);
                return;
            }
            
            // Agregar event listener
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`🖱️ Click en botón de editar → ${targetId}`);
                
                // Abrir modal personalizado
                targetModal.style.display = 'flex';
                targetModal.classList.add('show');
                document.body.style.overflow = 'hidden';
                
                console.log('✅ Modal de editar abierto');
            });
        });
        
        // Configurar botones de cerrar
        const closeButtons = document.querySelectorAll('.modal-cerrar-evento');
        
        closeButtons.forEach(closeBtn => {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const modal = this.closest('.modal-overlay-evento');
                
                if (modal) {
                    console.log('🚪 Cerrando modal personalizado');
                    modal.style.display = 'none';
                    modal.classList.remove('show');
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Cerrar con click en overlay
        const modals = document.querySelectorAll('.modal-overlay-evento');
        
        modals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    console.log('🚪 Cerrando por click en overlay');
                    this.style.display = 'none';
                    this.classList.remove('show');
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Cerrar con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal-overlay-evento.show');
                if (openModal) {
                    console.log('🚪 Cerrando con ESC');
                    openModal.style.display = 'none';
                    openModal.classList.remove('show');
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // ========================================================================
    // MÓDULO: MODAL DE ADMINISTRACIÓN
    // ========================================================================
    
    function initAdminModal() {
        const adminModal = document.getElementById('adminModal');
        const adminAddBtn = document.getElementById('adminAddBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const adminSolutionForm = document.getElementById('addSolutionForm');

        if (!adminModal || !adminAddBtn || !adminSolutionForm) {
            console.log('ℹ️ Modal de administración no disponible');
            return;
        }

        console.log('🔐 Inicializando modal de administración...');

        // Abrir modal
        adminAddBtn.addEventListener('click', () => {
            console.log('✨ Abriendo modal...');
            adminModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Cerrar modal
        function closeModal() {
            console.log('🚪 Cerrando modal...');
            adminModal.classList.remove('active');
            document.body.style.overflow = '';
            adminSolutionForm.reset();
            
            const input = document.getElementById("solutionIcon");
            const preview = document.getElementById("iconPreview");
            const popup = document.getElementById("catalogPopup");
            const searchInp = document.getElementById("searchInput");
            
            if (input) input.value = '';
            if (preview) {
                preview.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none" opacity=".35"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
            }
            if (popup) popup.classList.remove("open");
            if (searchInp) searchInp.value = '';
            
            clearImagePreview();
            
            const radioIcon = document.getElementById('radioIcon');
            const iconSection = document.getElementById('iconSection');
            const imageSection = document.getElementById('imageSection');
            
            if (radioIcon) radioIcon.checked = true;
            if (iconSection) iconSection.style.display = 'block';
            if (imageSection) imageSection.style.display = 'none';
        }

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        adminModal.addEventListener('click', (e) => {
            if (e.target === adminModal) closeModal();
        });

        // Manejar envío del formulario
        initFormSubmit(adminSolutionForm, closeModal);

        console.log('✅ Modal de administración inicializado');
    }

    // ========================================================================
    // MÓDULO: ENVÍO DE FORMULARIO
    // ========================================================================
    
    function initFormSubmit(form, closeModalCallback) {
        if (!form) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const titulo = document.getElementById('solutionTitle').value.trim();
            const descripcion = document.getElementById('solutionDescription').value.trim();
            const categoria = document.getElementById('solutionCategory').value;
            const url = document.getElementById('solutionUrl').value.trim();
            const imageType = document.querySelector('input[name="imageType"]:checked')?.value || 'icon';
            
            if (!titulo || !descripcion || !categoria || !url) {
                alert('❌ Por favor completa todos los campos obligatorios');
                return;
            }

            const formData = new FormData();
            formData.append('titulo', titulo);
            formData.append('descripcion', descripcion);
            formData.append('categoria', categoria);
            formData.append('url', url);
            formData.append('tipo_imagen', imageType);

            if (imageType === 'icon') {
                const iconoNombre = document.getElementById('solutionIcon').value.trim();
                if (!iconoNombre) {
                    alert('❌ Por favor selecciona un icono');
                    return;
                }
                formData.append('icono_nombre', iconoNombre);
            } else {
                const imageFile = document.getElementById('solutionImage').files[0];
                if (!imageFile) {
                    alert('❌ Por favor selecciona una imagen PNG');
                    return;
                }
                formData.append('icono', imageFile);
            }

            try {
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalButtonContent = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner"><circle cx="12" cy="12" r="10"></circle></svg> Agregando...';

                const response = await fetch('agregar-solucion/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                });

                const data = await response.json();

                if (data.success) {
                    console.log('✅ Solución agregada exitosamente');
                    closeModalCallback();
                    window.location.reload();
                } else {
                    alert('❌ ' + (data.error || 'Error al agregar la solución'));
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalButtonContent;
                }
            } catch (error) {
                console.error('❌ Error:', error);
                alert('❌ Error al agregar la solución. Por favor intenta de nuevo.');
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
            }
        });
    }

    // ========================================================================
    // MÓDULO: CATÁLOGO DE ICONOS
    // ========================================================================
    
    function initIconCatalog() {
        const popup = document.getElementById("catalogPopup");
        const grid = document.getElementById("catalogGrid");
        const tabs = document.getElementById("catalogTabs");
        const preview = document.getElementById("iconPreview");
        const input = document.getElementById("solutionIcon");
        const searchInp = document.getElementById("searchInput");
        const btnOpen = document.getElementById("btnOpen");
        const btnClose = document.getElementById("btnClose");

        if (!popup || !grid || !tabs || !preview || !input || !searchInp || !btnOpen || !btnClose) {
            console.log('ℹ️ Catálogo de íconos no disponible');
            return;
        }

        console.log('🎨 Inicializando catálogo de íconos...');

        // Variables locales del catálogo principal
        let activeCategory = "Todas";
        let searchText = "";
        let selectedIcon = null;

        // Renderizar tabs
        function renderTabs() {
            tabs.innerHTML = "";
            categories.forEach(cat => {
                const btn = document.createElement("button");
                btn.textContent = cat;
                btn.className = cat === activeCategory ? "active" : "";
                btn.addEventListener("click", () => {
                    activeCategory = cat;
                    renderTabs();
                    renderGrid();
                });
                tabs.appendChild(btn);
            });
        }

        // Renderizar grid de iconos
        function renderGrid() {
            grid.innerHTML = "";
            const filtered = ICONS_CATALOG.filter(ic => {
                const matchCat = activeCategory === "Todas" || ic.cat === activeCategory;
                const matchSearch = !searchText || ic.name.toLowerCase().includes(searchText.toLowerCase());
                return matchCat && matchSearch;
            });

            if (filtered.length === 0) {
                grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#999;">No se encontraron íconos</p>';
                return;
            }

            filtered.forEach(ic => {
                const item = document.createElement("div");
                item.className = "catalog-item";
                
                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("viewBox", "0 0 24 24");
                svg.setAttribute("width", "40");
                svg.setAttribute("height", "40");
                
                ic.paths.forEach(p => {
                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", p.d);
                    if (p.fill) path.setAttribute("fill", "currentColor");
                    svg.appendChild(path);
                });

                const label = document.createElement("span");
                label.textContent = ic.name;

                item.appendChild(svg);
                item.appendChild(label);

                item.addEventListener("click", () => {
                    selectedIcon = ic;
                    input.value = ic.name;
                    updatePreview();
                    popup.classList.remove("open");
                });

                grid.appendChild(item);
            });
        }

        // Actualizar vista previa
        function updatePreview() {
            if (!selectedIcon) return;
            preview.innerHTML = "";
            
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.setAttribute("width", "24");
            svg.setAttribute("height", "24");
            
            selectedIcon.paths.forEach(p => {
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", p.d);
                if (p.fill) path.setAttribute("fill", "currentColor");
                svg.appendChild(path);
            });
            
            preview.appendChild(svg);
        }

        // Eventos
        btnOpen.addEventListener("click", () => {
            popup.classList.add("open");
            renderTabs();
            renderGrid();
        });

        btnClose.addEventListener("click", () => {
            popup.classList.remove("open");
            searchInp.value = '';
            searchText = '';
        });

        popup.addEventListener("click", (e) => {
            // Cerrar si se hace clic en el backdrop (::before) o en el contenedor principal
            if (e.target === popup || e.target.classList.contains('catalog-popup')) {
                popup.classList.remove("open");
                searchInp.value = '';
                searchText = '';
            }
        });

        searchInp.addEventListener("input", (e) => {
            searchText = e.target.value;
            renderGrid();
        });

        console.log('✅ Catálogo de íconos inicializado');
    }

    // ========================================================================
    // MÓDULO: CATÁLOGO DE ICONOS PARA MODALES DE EDITAR
    // ========================================================================
    
    function initEditIconCatalogs() {
        console.log('🎨 Inicializando catálogos de íconos para edición...');
        
        // Buscar todos los botones de abrir catálogo en modales de editar
        const editButtons = document.querySelectorAll('[id^="btnOpenEdit"]');
        
        if (editButtons.length === 0) {
            console.log('ℹ️ No hay modales de edición con catálogo de iconos');
            return;
        }
        
        editButtons.forEach(btnOpen => {
            // Extraer el ID de la solución del botón
            const solutionId = btnOpen.id.replace('btnOpenEdit', '');
            
            const popup = document.getElementById(`catalogPopupEdit${solutionId}`);
            const grid = document.getElementById(`catalogGridEdit${solutionId}`);
            const tabs = document.getElementById(`catalogTabsEdit${solutionId}`);
            const preview = document.getElementById(`iconPreviewEdit${solutionId}`);
            const input = document.getElementById(`editSolutionIcon${solutionId}`);
            const searchInp = document.getElementById(`searchInputEdit${solutionId}`);
            const btnClose = document.getElementById(`btnCloseEdit${solutionId}`);
            
            if (!popup || !grid || !tabs || !preview || !input || !searchInp || !btnClose) {
                console.log(`⚠️ Elementos faltantes para modal ${solutionId}`);
                return;
            }
            
            // Variables locales para este catálogo
            let activeCategory = "Todas";
            let searchText = "";
            let selectedIcon = null;
            
            // Renderizar tabs
            function renderTabs() {
                tabs.innerHTML = "";
                categories.forEach(cat => {
                    const btn = document.createElement("button");
                    btn.textContent = cat;
                    btn.className = cat === activeCategory ? "active" : "";
                    btn.addEventListener("click", () => {
                        activeCategory = cat;
                        renderTabs();
                        renderGrid();
                    });
                    tabs.appendChild(btn);
                });
            }
            
            // Renderizar grid de iconos
            function renderGrid() {
                grid.innerHTML = "";
                const filtered = ICONS_CATALOG.filter(ic => {
                    const matchCat = activeCategory === "Todas" || ic.cat === activeCategory;
                    const matchSearch = !searchText || ic.name.toLowerCase().includes(searchText.toLowerCase());
                    return matchCat && matchSearch;
                });
                
                if (filtered.length === 0) {
                    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#999;">No se encontraron íconos</p>';
                    return;
                }
                
                filtered.forEach(ic => {
                    const item = document.createElement("div");
                    item.className = "catalog-item";
                    
                    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svg.setAttribute("viewBox", "0 0 24 24");
                    svg.setAttribute("width", "40");
                    svg.setAttribute("height", "40");
                    
                    ic.paths.forEach(p => {
                        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        path.setAttribute("d", p.d);
                        if (p.fill) path.setAttribute("fill", "currentColor");
                        svg.appendChild(path);
                    });
                    
                    const label = document.createElement("span");
                    label.textContent = ic.name;
                    
                    item.appendChild(svg);
                    item.appendChild(label);
                    
                    item.addEventListener("click", () => {
                        selectedIcon = ic;
                        input.value = ic.name;
                        updatePreview();
                        popup.classList.remove("open");
                    });
                    
                    grid.appendChild(item);
                });
            }
            
            // Actualizar vista previa
            function updatePreview() {
                if (!selectedIcon) return;
                preview.innerHTML = "";
                
                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("viewBox", "0 0 24 24");
                svg.setAttribute("width", "24");
                svg.setAttribute("height", "24");
                
                selectedIcon.paths.forEach(p => {
                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", p.d);
                    if (p.fill) path.setAttribute("fill", "currentColor");
                    svg.appendChild(path);
                });
                
                preview.appendChild(svg);
            }
            
            // Eventos
            btnOpen.addEventListener("click", () => {
                popup.classList.add("open");
                renderTabs();
                renderGrid();
            });
            
            btnClose.addEventListener("click", () => {
                popup.classList.remove("open");
                searchInp.value = '';
                searchText = '';
            });
            
            popup.addEventListener("click", (e) => {
                // Cerrar si se hace clic en el backdrop o en el contenedor principal
                if (e.target === popup || e.target.classList.contains('catalog-popup')) {
                    popup.classList.remove("open");
                    searchInp.value = '';
                    searchText = '';
                }
            });
            
            searchInp.addEventListener("input", (e) => {
                searchText = e.target.value;
                renderGrid();
            });
            
            console.log(`✅ Catálogo de íconos inicializado para solución ${solutionId}`);
        });
        
        console.log('✅ Todos los catálogos de edición inicializados');
    }

    // ========================================================================
    // MÓDULO: CARGA DE IMÁGENES
    // ========================================================================
    
    function initImageUpload() {
        const fileInput = document.getElementById('solutionImage');
        const uploadBox = document.getElementById('uploadBox');
        const imagePreview = document.getElementById('imagePreview');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
        const removeImageBtn = document.getElementById('removeImageBtn');

        if (!fileInput || !uploadBox) {
            console.log('ℹ️ Sistema de carga de imágenes no disponible');
            return;
        }

        console.log('📤 Inicializando carga de imágenes...');

        // Click en área de upload
        uploadBox.addEventListener('click', (e) => {
            if (!e.target.closest('.remove-image-btn') && !e.target.closest('.image-preview-container')) {
                fileInput.click();
            }
        });

        // Drag and drop
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = 'var(--color-primary)';
            uploadBox.style.background = 'rgba(61, 177, 3, 0.1)';
        });

        uploadBox.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = '#e5e7eb';
            uploadBox.style.background = '#fafafa';
        });

        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = '#e5e7eb';
            uploadBox.style.background = '#fafafa';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleImageUpload(files[0]);
            }
        });

        // Cambio en input file
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleImageUpload(file);
            }
        });

        // Remover imagen
        if (removeImageBtn) {
            removeImageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                clearImagePreview();
            });
        }

        // Manejar carga de imagen
        function handleImageUpload(file) {
            console.log('📤 Procesando imagen:', file.name);

            if (!file.type.match('image/png')) {
                alert('❌ Solo se permiten archivos PNG.');
                return;
            }
            
            if (file.size > CONFIG.MAX_IMAGE_SIZE) {
                alert('❌ La imagen es demasiado grande. Máximo 2MB.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                if (imagePreview && imagePreviewContainer) {
                    imagePreview.src = e.target.result;
                    imagePreviewContainer.style.display = 'flex';
                    console.log('✅ Imagen cargada correctamente');
                }
            };
            reader.readAsDataURL(file);
        }

        console.log('✅ Carga de imágenes inicializada');
    }

    // ========================================================================
    // MÓDULO: TOGGLE TIPO DE IMAGEN (ICONO vs PNG)
    // ========================================================================
    
    function initImageTypeToggle() {
        const radioIcon = document.getElementById('radioIcon');
        const radioImage = document.getElementById('radioImage');
        const iconSection = document.getElementById('iconSection');
        const imageSection = document.getElementById('imageSection');

        if (!radioIcon || !radioImage || !iconSection || !imageSection) {
            console.log('ℹ️ Toggle de tipo de imagen no disponible');
            return;
        }

        console.log('🔄 Inicializando toggle de tipo de imagen...');

        function toggleSections() {
            if (radioIcon.checked) {
                iconSection.style.display = 'block';
                imageSection.style.display = 'none';
            } else if (radioImage.checked) {
                iconSection.style.display = 'none';
                imageSection.style.display = 'block';
            }
        }

        radioIcon.addEventListener('change', toggleSections);
        radioImage.addEventListener('change', toggleSections);

        toggleSections();

        console.log('✅ Toggle de tipo de imagen inicializado');
    }

    // ========================================================================
    // UTILIDADES
    // ========================================================================
    
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function clearImagePreview() {
        console.log('🗑️ Limpiando preview de imagen...');
        const fileInput = document.getElementById('solutionImage');
        const imagePreview = document.getElementById('imagePreview');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
        
        if (fileInput) fileInput.value = '';
        if (imagePreview) imagePreview.src = '';
        if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
    }

    // Exponer funciones globales necesarias
    window.clearImagePreview = clearImagePreview;

    // ========================================================================
    // INICIAR APLICACIÓN
    // ========================================================================
    
    init();

})();

// ============================================================================
// MÓDULOS INDEPENDIENTES (FUERA DEL SCOPE PRINCIPAL)
// ============================================================================

/**
 * MÓDULO: BÚSQUEDA Y FILTROS
 */
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('search-solutions');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.info-card');
        const noResults = document.querySelector('.no-results');

        if (!searchInput || !filterButtons.length || !cards.length) {
            console.log('ℹ️ Búsqueda y filtros no disponibles');
            return;
        }

        console.log('🔍 Inicializando búsqueda y filtros...');

        let currentFilter = 'all';

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter');
                filterCards();
            });
        });

        searchInput.addEventListener('input', () => {
            filterCards();
        });

        function filterCards() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            let visibleCount = 0;

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const description = card.querySelector('.card-description')?.textContent.toLowerCase() || '';

                const matchesFilter = currentFilter === 'all' || category === currentFilter;
                const matchesSearch = !searchTerm || 
                                    title.includes(searchTerm) || 
                                    description.includes(searchTerm);

                if (matchesFilter && matchesSearch) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (noResults) {
                noResults.style.display = visibleCount === 0 ? 'flex' : 'none';
            }
        }

        console.log('✅ Búsqueda y filtros inicializados');
    });

})();

/**
 * MÓDULO: BOTONES DE ACCIÓN DE TARJETAS
 */
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        console.log('🔗 Inicializando botones de tarjetas...');
        
        document.querySelectorAll('.card-link-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const url = this.getAttribute('data-url');
                if (url) window.open(url, '_blank');
            });
        });

        console.log('✅ Botones de tarjetas inicializados');
    });

})();

/**
 * MÓDULO: MENÚ MÓVIL
 */
(function() {
    'use strict';

    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        console.log('📱 Inicializando menú móvil...');
        
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.setAttribute(
                'aria-expanded',
                mobileMenu.classList.contains('active')
            );
        });

        console.log('✅ Menú móvil inicializado');
    }

})();

/**
 * MÓDULO: SCROLL TO TOP
 */
(function() {
    'use strict';

    const scrollToTopBtn = document.querySelector('.scroll-to-top');

    if (scrollToTopBtn) {
        console.log('⬆️ Inicializando botón scroll to top...');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        console.log('✅ Botón scroll to top inicializado');
    }

})();

/**
 * MÓDULO: CONTADOR ANIMADO
 */
(function() {
    'use strict';

    const trustNumbers = document.querySelectorAll('.trust-number');
    let hasAnimated = false;

    if (trustNumbers.length === 0) return;

    console.log('🔢 Inicializando contadores animados...');

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                trustNumbers.forEach(number => {
                    animateCounter(number);
                });
            }
        });
    }, observerOptions);

    const trustSignals = document.querySelector('.trust-signals');
    if (trustSignals) {
        observer.observe(trustSignals);
    }

    console.log('✅ Contadores animados inicializados');

})();

/**
 * MÓDULO: DROPDOWN DE LOGIN MÓVIL
 */
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const mobileLoginTrigger = document.getElementById('mobileLoginTrigger');
        const mobileLoginDropdown = document.getElementById('mobileLoginDropdown');
        
        if (mobileLoginTrigger && mobileLoginDropdown) {
            console.log('📱 Inicializando dropdown de login móvil...');
            
            mobileLoginTrigger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                mobileLoginDropdown.classList.toggle('active');
                mobileLoginTrigger.classList.toggle('active');
            });
            
            document.addEventListener('click', function(e) {
                if (!mobileLoginTrigger.contains(e.target) && 
                    !mobileLoginDropdown.contains(e.target)) {
                    mobileLoginDropdown.classList.remove('active');
                    mobileLoginTrigger.classList.remove('active');
                }
            });
            
            mobileLoginDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
            
            console.log('✅ Dropdown de login móvil inicializado');
        }
    });

})();

/**
 * MÓDULO: TOGGLE DE TIPO DE IMAGEN EN EDICIÓN
 */
document.addEventListener("change", function (e) {
    if (e.target.name === "editImageType") {
        const form = e.target.closest("form");
        const iconSection = form.querySelector(".editIconSection");
        const imageSection = form.querySelector(".editImageSection");
        const iconInput = iconSection?.querySelector("input[type='text']");
        const imageInput = imageSection?.querySelector("input[type='file']");

        if (iconSection) iconSection.style.display = "none";
        if (imageSection) imageSection.style.display = "none";

        if (iconInput) iconInput.value = "";
        if (imageInput) imageInput.value = "";

        if (e.target.value === "icon" && iconSection) iconSection.style.display = "flex";
        if (e.target.value === "image" && imageSection) imageSection.style.display = "flex";
    }
});

/**
 * MÓDULO: LOGIN
 */
(function() {
    'use strict';

    console.log('🔐 Inicializando módulo de login...');

    const CONFIG = {
        SCROLL_DURATION: 500
    };

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initLoginModules);
        } else {
            initLoginModules();
        }
    }

    function initLoginModules() {
        initLoginTriggerButton();
        initLoginDropdownClose();
        initFooterLoginLink();
        
        console.log('✅ Módulo de login completamente inicializado');
    }

    function initLoginTriggerButton() {
        const loginTrigger = document.getElementById('loginTrigger');
        const loginDropdown = document.getElementById('loginDropdown');
        
        if (!loginTrigger || !loginDropdown) {
            console.log('ℹ️ Botón de login no disponible');
            return;
        }
        
        console.log('🔘 Inicializando botón de login del header...');
        
        loginTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = loginDropdown.classList.toggle('active');
            loginTrigger.classList.toggle('active');
            loginTrigger.setAttribute('aria-expanded', isActive);
        });
        
        document.addEventListener('click', function(e) {
            if (!loginDropdown.contains(e.target) && !loginTrigger.contains(e.target)) {
                if (loginDropdown.classList.contains('active')) {
                    closeDropdown(loginTrigger, loginDropdown);
                }
            }
        });
        
        loginDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && loginDropdown.classList.contains('active')) {
                closeDropdown(loginTrigger, loginDropdown);
            }
        });
        
        console.log('✅ Botón de login del header inicializado');
    }

    function initLoginDropdownClose() {
        const closeBtn = document.querySelector('.close-dropdown');
        const loginDropdown = document.getElementById('loginDropdown');
        const loginTrigger = document.getElementById('loginTrigger');

        if (!closeBtn || !loginDropdown || !loginTrigger) {
            console.log('ℹ️ Botón de cerrar dropdown no disponible');
            return;
        }

        console.log('❌ Inicializando botón de cerrar dropdown...');

        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            closeDropdown(loginTrigger, loginDropdown);
        });

        console.log('✅ Botón de cerrar dropdown inicializado');
    }

    function initFooterLoginLink() {
        const footerLoginLink = document.getElementById('footerLoginLink');
        const loginTrigger = document.getElementById('loginTrigger');
        const loginDropdown = document.getElementById('loginDropdown');
        
        if (!footerLoginLink || !loginTrigger || !loginDropdown) {
            console.log('ℹ️ Enlace del footer no disponible');
            return;
        }
        
        console.log('🔗 Conectando enlace del footer...');
        
        footerLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            setTimeout(function() {
                openDropdown(loginTrigger, loginDropdown);
                
                const usernameInput = document.getElementById('username');
                if (usernameInput) {
                    usernameInput.focus();
                }
            }, CONFIG.SCROLL_DURATION);
        });
        
        console.log('✅ Enlace del footer configurado');
    }

    function openDropdown(trigger, dropdown) {
        dropdown.classList.add('active');
        trigger.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown(trigger, dropdown) {
        dropdown.classList.remove('active');
        trigger.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
    }

    init();

})();

/**
 * MÓDULO: ACCESIBILIDAD
 */
window.addEventListener('load', function() {
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
        if (img.naturalWidth && img.naturalHeight) {
            img.setAttribute('width', img.naturalWidth);
            img.setAttribute('height', img.naturalHeight);
        }
    });
});

/**
 * ============================================================================
 * SISTEMA DE MODALES - VERSIÓN SIMPLIFICADA Y FUNCIONAL
 * ============================================================================
 */

(function() {
    'use strict';

    console.log('🚀 Iniciando sistema de modales...');

    /**
     * Cerrar todos los modales al cargar la página
     */
    function closeAllModalsOnLoad() {
        console.log('🔒 Cerrando modales al cargar...');
        
        // Modales de Bootstrap
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        });
        
        // Modales personalizados
        document.querySelectorAll('.modal-overlay-evento').forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('show');
        });
        
        // Limpiar backdrops
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
        
        // Restaurar body
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        console.log('✅ Modales cerrados');
    }

    /**
     * Inicializar modales de ELIMINAR (Bootstrap)
     */
    function initDeleteModals() {
        console.log('🗑️ Inicializando modales de eliminar...');
        
        // Esperar a que Bootstrap esté disponible
        if (typeof bootstrap === 'undefined') {
            console.warn('⚠️ Bootstrap no disponible, reintentando...');
            setTimeout(initDeleteModals, 100);
            return;
        }
        
        const deleteButtons = document.querySelectorAll('.btn-eliminar');
        console.log(`   Encontrados ${deleteButtons.length} botones de eliminar`);
        
        deleteButtons.forEach(button => {
            const targetId = button.getAttribute('data-bs-target');
            
            if (!targetId) {
                console.warn('⚠️ Botón sin data-bs-target');
                return;
            }
            
            const modal = document.querySelector(targetId);
            
            if (!modal) {
                console.warn(`⚠️ Modal no encontrado: ${targetId}`);
                return;
            }
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`🖱️ Click en eliminar → ${targetId}`);
                
                try {
                    const bsModal = new bootstrap.Modal(modal, {
                        backdrop: true,
                        keyboard: true,
                        focus: true
                    });
                    bsModal.show();
                    console.log('✅ Modal de eliminar abierto');
                } catch (error) {
                    console.error('❌ Error:', error);
                }
            });
        });
        
        console.log('✅ Modales de eliminar configurados');
    }

    /**
     * Inicializar modales de EDITAR (personalizados)
     */
    function initEditModals() {
        console.log('✏️ Inicializando modales de editar...');
        
        const editButtons = document.querySelectorAll('.btn-editar');
        console.log(`   Encontrados ${editButtons.length} botones de editar`);
        
        editButtons.forEach(button => {
            const targetId = button.getAttribute('data-bs-target');
            
            if (!targetId) {
                console.warn('⚠️ Botón sin data-bs-target');
                return;
            }
            
            const modal = document.querySelector(targetId);
            
            if (!modal) {
                console.warn(`⚠️ Modal no encontrado: ${targetId}`);
                return;
            }
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`🖱️ Click en editar → ${targetId}`);
                
                modal.style.display = 'flex';
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
                
                console.log('✅ Modal de editar abierto');
            });
        });
        
        // Botones de cerrar
        document.querySelectorAll('.modal-cerrar-evento').forEach(closeBtn => {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const modal = this.closest('.modal-overlay-evento');
                if (modal) {
                    modal.style.display = 'none';
                    modal.classList.remove('show');
                    document.body.style.overflow = '';
                    console.log('🚪 Modal de editar cerrado');
                }
            });
        });
        
        // Click en overlay
        document.querySelectorAll('.modal-overlay-evento').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.style.display = 'none';
                    this.classList.remove('show');
                    document.body.style.overflow = '';
                    console.log('🚪 Modal cerrado por click en overlay');
                }
            });
        });
        
        // Tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal-overlay-evento.show');
                if (openModal) {
                    openModal.style.display = 'none';
                    openModal.classList.remove('show');
                    document.body.style.overflow = '';
                    console.log('🚪 Modal cerrado con ESC');
                }
            }
        });
        
        console.log('✅ Modales de editar configurados');
    }

    /**
     * Inicialización
     */
    function init() {
        closeAllModalsOnLoad();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(() => {
                    initDeleteModals();
                    initEditModals();
                }, 200);
            });
        } else {
            setTimeout(() => {
                initDeleteModals();
                initEditModals();
            }, 200);
        }
    }

    init();
    
    console.log('✅ Sistema de modales inicializado');

})();
/**
 * MENSAJE DE CONSOLA
 */
console.log('%c¡Bienvenido a Gestión del Conocimiento!', 'color: #3db103; font-size: 24px; font-weight: bold;');
console.log('%cRepositorio de Soluciones Tecnológicas del SENA', 'color: #50e5f9; font-size: 14px;');
console.log('%c💡 ¿Interesado en contribuir? Contáctanos.', 'color: #666; font-size: 12px;');


/**
 * ============================================================
 * MODALES DE ELIMINAR - 100% JAVASCRIPT PERSONALIZADO
 * ============================================================
 */

(function() {
    'use strict';
    
    console.log('🗑️ Inicializando sistema de modales de eliminar...');
    
    function initDeleteModals() {
        // Encontrar TODOS los botones de eliminar
        const deleteButtons = document.querySelectorAll('.btn-eliminar[data-modal-target]');
        
        console.log(`   Encontrados ${deleteButtons.length} botones de eliminar`);
        
        if (deleteButtons.length === 0) {
            console.warn('⚠️ No se encontraron botones de eliminar');
            return;
        }
        
        // Agregar evento click a cada botón
        deleteButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Obtener el ID del modal
                const modalId = this.getAttribute('data-modal-target');
                
                if (!modalId) {
                    console.error('❌ Botón sin data-modal-target');
                    return;
                }
                
                console.log(`🖱️ Click en eliminar → ${modalId}`);
                
                // Buscar el modal
                const modal = document.getElementById(modalId);
                
                if (!modal) {
                    console.error(`❌ Modal no encontrado: ${modalId}`);
                    return;
                }
                
                // Abrir el modal
                openDeleteModal(modal);
            });
        });
        
        // Configurar botones de cerrar en todos los modales
        setupCloseButtons();
        
        // Cerrar con click en overlay
        setupOverlayClose();
        
        // Cerrar con tecla ESC
        setupEscapeKey();
        
        console.log('✅ Sistema de modales de eliminar configurado');
    }
    
    function openDeleteModal(modal) {
        console.log('🔓 Abriendo modal de eliminar');
        
        // Agregar clase active
        modal.classList.add('active');
        
        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
        
        console.log('✅ Modal abierto');
    }
    
    function closeDeleteModal(modal) {
        console.log('🔒 Cerrando modal de eliminar');
        
        // Quitar clase active
        modal.classList.remove('active');
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
        
        console.log('✅ Modal cerrado');
    }
    
    function setupCloseButtons() {
        // Botones con clase .modal-delete-close
        const closeButtons = document.querySelectorAll('.modal-delete-close, .btn-close');
        
        closeButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Encontrar el modal padre
                const modal = this.closest('.modal-delete-overlay');
                
                if (modal) {
                    closeDeleteModal(modal);
                }
            });
        });
        
        // Botones "Cancelar" en el footer
        const cancelButtons = document.querySelectorAll('.modal-delete-footer .btn');
        
        cancelButtons.forEach(function(button) {
            // Solo si no es el botón de eliminar
            if (!button.classList.contains('btn-eliminar')) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const modal = this.closest('.modal-delete-overlay');
                    
                    if (modal) {
                        closeDeleteModal(modal);
                    }
                });
            }
        });
    }
    
    function setupOverlayClose() {
        const modals = document.querySelectorAll('.modal-delete-overlay');
        
        modals.forEach(function(modal) {
            modal.addEventListener('click', function(e) {
                // Solo cerrar si se hace click directamente en el overlay
                // No si se hace click en el contenido
                if (e.target === modal) {
                    closeDeleteModal(modal);
                }
            });
        });
    }
    
    function setupEscapeKey() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Buscar si hay algún modal abierto
                const openModal = document.querySelector('.modal-delete-overlay.active');
                
                if (openModal) {
                    closeDeleteModal(openModal);
                }
            }
        });
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDeleteModals);
    } else {
        initDeleteModals();
    }
    
})();


document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll('.modal-dialog-evento').forEach(modal => {

        const radios = modal.querySelectorAll('input[name="editImageType"]');
        const iconSection  = modal.querySelector('.editIconSection');
        const imageSection = modal.querySelector('.editImageSection');

        if (!radios.length || !iconSection || !imageSection) return;

        function updateSections() {
            const selected = modal.querySelector('input[name="editImageType"]:checked');

            if (!selected) return;

            if (selected.value === "icon") {
                iconSection.style.display  = "block";
                imageSection.style.display = "none";
            } else {
                iconSection.style.display  = "none";
                imageSection.style.display = "block";
            }
        }

        // 👉 estado inicial (CLAVE)
        updateSections();

        // 👉 cambios posteriores
        radios.forEach(radio => {
            radio.addEventListener("change", updateSections);
        });

    });

});