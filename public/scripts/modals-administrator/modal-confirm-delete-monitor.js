document.addEventListener('DOMContentLoaded', () => {
    const deleteMonitorModal = document.getElementById('confirm-delete-monitor-modal');
    const confirmDeleteMonitorBtn = document.getElementById('confirm-delete-monitor');
    const cancelDeleteMonitorBtn = document.getElementById('cancel-delete-monitor');
    let monitorIdToDelete = null;

    // Función para abrir el modal de confirmación de eliminación
    function openDeleteMonitorModal(event) {
        monitorIdToDelete = event.target.closest('tr').dataset.monitorId;
        console.log(`Abriendo modal para eliminar monitor con ID: ${monitorIdToDelete}`);
        deleteMonitorModal.classList.add('show');
    }

    // Añadir evento de clic a los botones de eliminar monitor
    function addDeleteMonitorEventListeners() {
        document.querySelectorAll('.btn-action.btn-delete-monitor').forEach(button => {
            button.addEventListener('click', openDeleteMonitorModal);
        });
    }

    // Llamar a la función para añadir eventos de clic a los botones de eliminar monitor
    addDeleteMonitorEventListeners();

    // Cerrar el modal de confirmación de eliminación
    cancelDeleteMonitorBtn.addEventListener('click', () => {
        deleteMonitorModal.classList.remove('show');
        monitorIdToDelete = null;
    });

    // Confirmar la eliminación del monitor
    confirmDeleteMonitorBtn.addEventListener('click', () => {
        if (monitorIdToDelete) {
            console.log(`Eliminando monitor con ID: ${monitorIdToDelete}`);
            fetch(`../../mvc/controllers/administrator/delete_monitor.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id=${monitorIdToDelete}`
            })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta del servidor:', data);
                if (data.status === "success") {
                    const rowToDelete = document.querySelector(`tr[data-monitor-id="${monitorIdToDelete}"]`);
                    rowToDelete.classList.add('fade-out'); // Añadir clase de animación
                    rowToDelete.addEventListener('animationend', () => {
                        rowToDelete.remove();
                    });
                }
                deleteMonitorModal.classList.remove('show');
                monitorIdToDelete = null;
            })
            .catch(error => {
                console.error('Error:', error);
                deleteMonitorModal.classList.remove('show');
                monitorIdToDelete = null;
            });
        }
    });

    // Exportar la función para añadir eventos de clic a los botones de eliminar monitor
    window.addDeleteMonitorEventListeners = addDeleteMonitorEventListeners;
});