document.addEventListener('DOMContentLoaded', function() {
    const activitiesTableBody = document.getElementById('activities-table-body');
    const deleteActivityModal = document.getElementById('confirm-delete-activity-modal');
    const confirmDeleteButton = document.getElementById('confirm-delete-activity');
    const cancelDeleteButton = document.getElementById('cancel-delete-activity');
    let currentActivityId = null;

    fetch('../../mvc/controllers/administrator/get_activities.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                data.activities.forEach(activity => {
                    const newRow = document.createElement('tr');
                    const nameCell = document.createElement('td');
                    nameCell.classList.add('name-cell');
                    nameCell.textContent = activity.nombre_actividad;

                    const buttonGroup = document.createElement('div');
                    buttonGroup.classList.add('button-group');

                    const redButton = document.createElement('button');
                    redButton.style.backgroundColor = 'red';
                    redButton.style.color = 'white';
                    redButton.classList.add('activities-red-button');
                    redButton.id = `activities-red-button-${activity.id}`;

                    // Añadir evento para mostrar el modal al hacer clic en el botón rojo
                    redButton.addEventListener('click', function() {
                        currentActivityId = activity.id;
                        deleteActivityModal.style.display = 'block';
                    });

                    // Añadir el botón rojo al contenedor buttonGroup
                    buttonGroup.appendChild(redButton);

                    // Añadir el contenedor buttonGroup a la celda nameCell
                    nameCell.appendChild(buttonGroup);

                    newRow.appendChild(nameCell);

                    activitiesTableBody.appendChild(newRow);
                });
            } else {
                console.error('Error al cargar las actividades:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Cerrar el modal
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

    // Usar MutationObserver para observar cambios en el DOM y agregar eventos a los nuevos botones
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.matches('tr')) {
                        const redButton = node.querySelector('.activities-red-button');
                        if (redButton) {
                            redButton.addEventListener('click', function() {
                                currentActivityId = redButton.id.split('-').pop();
                                deleteActivityModal.style.display = 'block';
                            });
                        }
                    }
                });
            }
        });
    });

    observer.observe(activitiesTableBody, { childList: true });
});