document.addEventListener('DOMContentLoaded', function() {
    const addActivityBtn = document.getElementById('add-activity-btn');
    const addActivityModal = document.getElementById('add-activity-modal');
    const cancelAddActivityBtn = document.getElementById('cancel-add-activity');
    const addActivityForm = document.getElementById('add-activity-form');
    const activityNameInput = document.getElementById('activity-name');
    const activityDescriptionInput = document.getElementById('activity-description');
    const activitiesTableBody = document.getElementById('activities-table-body');

    addActivityBtn.addEventListener('click', function() {
        addActivityModal.classList.add('show');
    });

    cancelAddActivityBtn.addEventListener('click', function() {
        addActivityModal.classList.remove('show');
        addActivityForm.reset(); // Restaurar el formulario
    });

    addActivityForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const activityName = activityNameInput.value.trim();
        const activityDescription = activityDescriptionInput.value.trim();

        if (activityName === '' || activityDescription === '') {
            alert('Todos los campos son obligatorios.');
            return;
        }

        // Enviar los datos al servidor
        fetch('../../mvc/controllers/administrator/add_activity.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `activity_name=${encodeURIComponent(activityName)}&activity_description=${encodeURIComponent(activityDescription)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                // Añadir la actividad a la tabla
                const newRow = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.classList.add('name-cell');
                nameCell.textContent = activityName;

                const buttonGroup = document.createElement('div');
                buttonGroup.classList.add('button-group');

                const redButton = document.createElement('button');
                redButton.style.backgroundColor = 'red';
                redButton.style.color = 'white';
                redButton.classList.add('activities-red-button');
                redButton.id = `activities-red-button-${data.activity_id}`;

                // Añadir evento para mostrar el modal al hacer clic en el botón rojo
                redButton.addEventListener('click', function() {
                    openDeleteModal(data.activity_id);
                });

                // Añadir el botón rojo al contenedor buttonGroup
                buttonGroup.appendChild(redButton);

                // Añadir el contenedor buttonGroup a la celda nameCell
                nameCell.appendChild(buttonGroup);

                newRow.appendChild(nameCell);

                activitiesTableBody.appendChild(newRow);

                // Cerrar el modal
                addActivityModal.classList.remove('show');

                // Restaurar el formulario
                addActivityForm.reset();
            } else {
                alert('Error al añadir la actividad.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al añadir la actividad.');
        });
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
                                openDeleteModal(redButton.id.split('-').pop());
                            });
                        }
                    }
                });
            }
        });
    });

    observer.observe(activitiesTableBody, { childList: true });
});

function openDeleteModal(activityId) {
    currentActivityId = activityId;
    deleteActivityModal.style.display = 'block';
}