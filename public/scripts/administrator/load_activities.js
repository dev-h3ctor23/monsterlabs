document.addEventListener('DOMContentLoaded', function() {
    const activitiesTableBody = document.getElementById('activities-table-body');

    fetch('../../mvc/controllers/administrator/get_activities.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                data.activities.forEach(activity => {
                    const newRow = document.createElement('tr');
                    const nameCell = document.createElement('td');
                    nameCell.textContent = activity.nombre_actividad;
                    const descriptionCell = document.createElement('td');
                    descriptionCell.textContent = activity.descripcion;
                    newRow.appendChild(nameCell);
                    newRow.appendChild(descriptionCell);
                    activitiesTableBody.appendChild(newRow);
                });
            } else {
                console.error('Error al cargar las actividades:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});