document.addEventListener('DOMContentLoaded', () => {
    const editProfileModal = document.getElementById('edit-profile-modal');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const saveEditBtn = document.getElementById('save-edit');
    const popup = document.getElementById('popup');

    // Abrir modal al hacer click en "Editar perfil"
    editProfileBtn.addEventListener('click', () => {
        editProfileModal.classList.add('show');
    });

    // Cerrar el modal al hacer click en "Cancelar"
    cancelEditBtn.addEventListener('click', () => {
        editProfileModal.classList.remove('show');
    });

});