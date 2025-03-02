document.addEventListener('DOMContentLoaded', function() {
    const addActivityBtn = document.getElementById('add-activity-btn');
    const addActivityModal = document.getElementById('add-activity-modal');
    const cancelAddActivityBtn = document.getElementById('cancel-add-activity');
    const addActivityForm = document.getElementById('add-activity-form');
    const activityNameInput = document.getElementById('activity-name');
    const activityDescriptionInput = document.getElementById('activity-description');

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
                const activitiesTableBody = document.getElementById('activities-table-body');
                const newRow = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = activityName;
                const descriptionCell = document.createElement('td');
                descriptionCell.textContent = activityDescription;
                newRow.appendChild(nameCell);
                newRow.appendChild(descriptionCell);
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
});