document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Filtrado dinámico del Menú ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover estado activo de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Activar botón seleccionado
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Mostrar u ocultar elementos del menú según la categoría
            menuItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --- 2. Menú móvil (Toggle) ---
    const mobileToggle = document.getElementById('mobile-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const navActions = document.querySelector('.nav-actions');
            if (navActions) {
                navActions.classList.toggle('active');
            }
        });
    }
});
