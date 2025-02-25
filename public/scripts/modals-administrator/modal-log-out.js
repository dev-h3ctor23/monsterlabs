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

    confirmLogout.addEventListener('click', () => {
        // ! Implementear la lógica para cerrar la sesión del usuario.
    });
});