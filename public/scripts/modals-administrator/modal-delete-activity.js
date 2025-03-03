document.addEventListener('DOMContentLoaded', function() {
    const deleteActivityModal = document.getElementById('confirm-delete-activity-modal');
    const confirmDeleteButton = document.getElementById('confirm-delete-activity');
    const cancelDeleteButton = document.getElementById('cancel-delete-activity');
    let currentActivityId = null;

    // Función para abrir el modal de eliminación
    function openDeleteModal(activityId) {
        currentActivityId = activityId;
        deleteActivityModal.style.display = 'block';
    }

    // Cerrar el modal de eliminación
    cancelDeleteButton.addEventListener('click', function() {
        deleteActivityModal.style.display = 'none';
    });

    // Confirmar la eliminación de la actividad
    confirmDeleteButton.addEventListener('click', function() {
        if (currentActivityId) {
            fetch(`../../mvc/controllers/administrator/delete_activity.php?id=${currentActivityId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    // Eliminar la fila de la tabla
                    const button = document.getElementById(`activities-red-button-${currentActivityId}`);
                    const row = button.closest('tr');
                    row.remove();
                    deleteActivityModal.style.display = 'none';
                } else {
                    console.error('Error al eliminar la actividad:', data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });

    // Cerrar el modal si se hace clic fuera de él
    window.addEventListener('click', function(event) {
        if (event.target == deleteActivityModal) {
            deleteActivityModal.style.display = 'none';
        }
    });

    // Exportar la función para abrir el modal
    window.openDeleteModal = openDeleteModal;
});