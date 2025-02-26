document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.menu-links li.nav-link a');
    const sections = document.querySelectorAll('.section-content');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1); // Obtiene el id sin el '#'

            // Oculta todas las secciones con animación de desaparición
            sections.forEach(section => {
                if (section.classList.contains('active')) {
                    section.classList.remove('fade-in');
                    section.classList.add('fade-out');
                    section.addEventListener('animationend', () => {
                        section.classList.remove('active');
                        section.classList.remove('fade-out');

                        // Muestra la sección asociada con animación de aparición
                        const targetSection = document.getElementById(targetId);
                        if (targetSection) { // Si la sección existe
                            targetSection.classList.add('active');
                            targetSection.classList.add('fade-in');
                        }
                    }, { once: true });
                }
            });
        });
    });

    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('.menu-links li.nav-link a');
        if (link) {  // Si el elemento es un enlace de navegación en la barra lateral del administrador. 
            e.preventDefault(); // Previene la acción por defecto del enlace.
            const targetId = link.getAttribute('href').substring(1);
            const sections = document.querySelectorAll('.section-content');
            
            // Oculta todas las secciones con animación de desaparición
            sections.forEach(section => {
                if (section.classList.contains('active')) {
                    section.classList.remove('fade-in');
                    section.classList.add('fade-out');
                    section.addEventListener('animationend', () => {
                        section.classList.remove('active');
                        section.classList.remove('fade-out');

                        // Muestra la sección asociada con animación de aparición
                        const targetSection = document.getElementById(targetId);
                        if (targetSection) {
                            targetSection.classList.add('active');
                            targetSection.classList.add('fade-in');
                        }
                    }, { once: true });
                }
            });
        }
    });
});