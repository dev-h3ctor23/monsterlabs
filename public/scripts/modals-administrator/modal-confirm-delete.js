document.addEventListener('DOMContentLoaded', () => {
    const deleteModal = document.getElementById('confirm-delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');

    document.querySelectorAll('.btn-action.btn-delete').forEach(button => {
        button.addEventListener('click', () => {
            deleteModal.classList.add('show');
        });
    });

    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.remove('show');
    });

    confirmDeleteBtn.addEventListener('click', () => {
        // Aquí puedes añadir la lógica para eliminar al participante
        deleteModal.classList.remove('show');
        alert('Participante eliminado');
    });
});