// Funcionalidad del sidebar
document.addEventListener('DOMContentLoaded', function() {
    // Cargar el sidebar desde el archivo externo
    loadSidebar();
    
    // Función para cargar el sidebar
    function loadSidebar() {
        const sidebarContainer = document.getElementById('sidebar-container');
        if (sidebarContainer) {
            fetch('sidebar.html')
                .then(response => response.text())
                .then(data => {
                    sidebarContainer.innerHTML = data;
                    sidebarContainer.classList.add('loaded');
                    initializeSidebar();
                })
                .catch(error => {
                    console.error('Error cargando el sidebar:', error);
                    sidebarContainer.classList.add('loaded');
                });
        }
    }
    
    // Función para inicializar el sidebar después de cargarlo
    function initializeSidebar() {
        // Función para manejar el menú móvil
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        const sidebarContainer = document.getElementById('sidebar-container');
    
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', function() {
                sidebar.classList.toggle('open');
                sidebarContainer.classList.toggle('open');
                overlay.classList.toggle('active');
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('open');
                sidebarContainer.classList.remove('open');
                overlay.classList.remove('active');
            });
        }
        
        // Marcar el elemento activo según la página actual
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                item.classList.add('active');
            }
        });

        // Manejar submenus y marcar subitems activos
        const submenuToggles = document.querySelectorAll('.submenu-toggle');
        submenuToggles.forEach(btn => {
            const group = btn.closest('.nav-group');
            const submenu = group ? group.querySelector('.submenu') : null;

            function openGroup() {
                if (!group) return;
                group.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
                if (submenu) {
                    submenu.style.visibility = 'visible';
                    submenu.style.pointerEvents = 'auto';
                    submenu.style.opacity = '1';
                    submenu.style.marginTop = '0.5rem';
                    submenu.style.maxHeight = submenu.scrollHeight + 'px';
                }
            }

            function closeGroup() {
                if (!group) return;
                group.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
                if (submenu) {
                    submenu.style.opacity = '0';
                    submenu.style.maxHeight = '0';
                    // esperar a la transición antes de ocultar totalmente
                    setTimeout(() => {
                        if (!group.classList.contains('open')) {
                            submenu.style.visibility = 'hidden';
                            submenu.style.pointerEvents = 'none';
                            submenu.style.marginTop = '0';
                        }
                    }, 300);
                }
            }

            btn.addEventListener('click', (e) => {
                // evitar que actúe como submit o enlace
                e.preventDefault();
                const isOpen = group.classList.contains('open');
                if (isOpen) closeGroup(); else openGroup();
            });

            // Si el grupo ya viene con .open (por ejemplo marcado en server-side), ajustar estilos
            if (group && group.classList.contains('open')) {
                // forzar cálculo de altura
                if (submenu) {
                    submenu.style.visibility = 'visible';
                    submenu.style.pointerEvents = 'auto';
                    submenu.style.opacity = '1';
                    submenu.style.maxHeight = submenu.scrollHeight + 'px';
                }
                btn.setAttribute('aria-expanded', 'true');
            }
        });

        // Marcar subitem activo si coincide con la página
        const navSubitems = document.querySelectorAll('.nav-subitem');
        navSubitems.forEach(sub => {
            const href = sub.getAttribute('href');
            if (href === currentPage) {
                sub.classList.add('active');
                // abrir el grupo padre
                const group = sub.closest('.nav-group');
                if (group) {
                    group.classList.add('open');
                    const toggle = group.querySelector('.submenu-toggle');
                    if (toggle) toggle.setAttribute('aria-expanded', 'true');
                }
            }
        });
        
        // Cerrar sidebar en móviles al hacer clic en un enlace
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                    sidebarContainer.classList.remove('open');
                    overlay.classList.remove('active');
                }
            });
        });
    }
});
