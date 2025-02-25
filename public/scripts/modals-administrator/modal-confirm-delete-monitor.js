document.addEventListener('DOMContentLoaded', () => {
    const deleteMonitorModal = document.getElementById('confirm-delete-monitor-modal');
    const confirmDeleteMonitorBtn = document.getElementById('confirm-delete-monitor');
    const cancelDeleteMonitorBtn = document.getElementById('cancel-delete-monitor');

    document.querySelectorAll('.btn-action.btn-delete-monitor').forEach(button => {
        button.addEventListener('click', () => {
            deleteMonitorModal.classList.add('show');
        });
    });

    cancelDeleteMonitorBtn.addEventListener('click', () => {
        deleteMonitorModal.classList.remove('show');
    });

    confirmDeleteMonitorBtn.addEventListener('click', () => {
        // Aquí puedes añadir la lógica para eliminar al monitor
        deleteMonitorModal.classList.remove('show');
        alert('Monitor eliminado');
    });
});