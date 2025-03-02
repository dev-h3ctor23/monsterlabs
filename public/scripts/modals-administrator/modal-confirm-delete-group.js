document.addEventListener('DOMContentLoaded', () => {
    const deleteGroupModal = document.getElementById('confirm-delete-group-modal');
    const confirmDeleteGroupBtn = document.getElementById('confirm-delete-group');
    const cancelDeleteGroupBtn = document.getElementById('cancel-delete-group');

    document.querySelectorAll('.btn-action.btn-delete-group').forEach(button => {
        button.addEventListener('click', () => {
            deleteGroupModal.classList.add('show');
        });
    });

    cancelDeleteGroupBtn.addEventListener('click', () => {
        deleteGroupModal.classList.remove('show');
    });

    confirmDeleteGroupBtn.addEventListener('click', () => {
        // Aquí puedes añadir la lógica para eliminar el grupo
        deleteGroupModal.classList.remove('show');
        alert('Grupo eliminado');
    });
});