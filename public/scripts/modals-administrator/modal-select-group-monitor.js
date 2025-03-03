document.addEventListener('DOMContentLoaded', function() {
    const selectGroupMonitorModal = document.getElementById('select-group-monitor-modal');
    const selectGroupMonitorForm = document.getElementById('select-group-monitor-form');
    const groupSelectMonitor = document.getElementById('group-select-monitor');
    const cancelSelectGroupMonitorButton = document.getElementById('cancel-select-group-monitor');
    let currentMonitorId = null;

    // Función para abrir el modal de selección de grupo para el monitor
    function openSelectGroupMonitorModal(monitorId) {
        currentMonitorId = monitorId;
        fetch('../../mvc/controllers/administrator/load_groups.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    groupSelectMonitor.innerHTML = '';
                    data.groups.forEach(group => {
                        const option = document.createElement('option');
                        option.value = group.id_grupo;
                        option.textContent = group.nombre_grupo;
                        groupSelectMonitor.appendChild(option);
                    });
                    selectGroupMonitorModal.classList.add('show');
                } else {
                    console.error('Error al cargar los grupos:', data.message);
                }
            })
            .catch(error => console.error('Error al cargar los grupos:', error));
    }

    // Cerrar el modal de selección de grupo para el monitor
    cancelSelectGroupMonitorButton.addEventListener('click', function() {
        selectGroupMonitorModal.classList.remove('show');
    });

    // Manejar el envío del formulario de selección de grupo para el monitor
    selectGroupMonitorForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const data = {
            monitor_id: currentMonitorId,
            group_id: groupSelectMonitor.value
        };

        // Depuración: Verificar los valores antes de enviar
        console.log('monitor_id:', currentMonitorId);
        console.log('group_id:', groupSelectMonitor.value);

        fetch(`../../mvc/controllers/administrator/update_monitor_group.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                selectGroupMonitorModal.classList.remove('show');
                alert('Grupo del monitor actualizado correctamente.');
            } else {
                console.error('Error al actualizar el grupo del monitor:', data.message);
            }
        })
        .catch(error => console.error('Error al actualizar el grupo del monitor:', error));
    });

    // Exportar la función para abrir el modal
    window.openSelectGroupMonitorModal = openSelectGroupMonitorModal;
});