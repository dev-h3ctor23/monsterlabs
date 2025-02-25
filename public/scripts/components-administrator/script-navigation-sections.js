document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.menu-links li.nav-link a');
    const sections = document.querySelectorAll('.section-content');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1); // ! Obtiene el id sin el '#'

            // * Oculta todas las secciones
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // * Muestra la sección asociada
            const targetSection = document.getElementById(targetId);
            if (targetSection) { // * Si la sección existe
                targetSection.classList.add('active'); // * Muestra la sección
            }
        });
    });

    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('.menu-links li.nav-link a');
        if (link) {  // * Si el elemento es un enlace de navegación en la barra lateral del administrador. 
            e.preventDefault(); // * Previene la acción por defecto del enlace.
            const targetId = link.getAttribute('href').substring(1);
            const sections = document.querySelectorAll('.section-content');
            sections.forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        }
    });
});