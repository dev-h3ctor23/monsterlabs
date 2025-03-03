document.addEventListener('click', (e) => {
    if (e.target.closest('#logout-btn')) {
        e.preventDefault();
        const logoutModal = document.getElementById('logout-modal');
        logoutModal.classList.add('show');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const logoutModal = document.getElementById('logout-modal');
    const confirmLogout = document.getElementById('confirm-logout');
    const cancelLogout = document.getElementById('cancel-logout');

    cancelLogout.addEventListener('click', () => {
        logoutModal.classList.remove('show');
    });

    confirmLogout.addEventListener('click', (event) => {
        event.preventDefault();

        fetch("/monsterlabs/mvc/controllers/logout.php")
            .then(response => response.json()) // Parsear la respuesta como JSON
            .then(data => {
                if (data.redirect) {
                    // Redirigir al usuario si la respuesta indica una redirección
                    window.location.href = data.redirect;
                }
            })
            .catch(error => console.error("Error al cerrar sesión:", error));
    });
});