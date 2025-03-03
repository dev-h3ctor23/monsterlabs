
    document.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        const scrollPosition = window.scrollY;
    
        if (scrollPosition > 40) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });