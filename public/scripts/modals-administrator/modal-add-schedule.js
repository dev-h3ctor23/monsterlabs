document.addEventListener('DOMContentLoaded', function() {
    const addScheduleBtn = document.getElementById('add-schedule-btn');
    const addScheduleModal = document.getElementById('add-schedule-modal');
    const addScheduleForm = document.getElementById('add-schedule-form');
    const cancelAddScheduleBtn = document.getElementById('cancel-add-schedule');
    const activitySelect = document.getElementById('activity-select');
    const groupSelect = document.getElementById('group-select');

    // Función para abrir el modal de añadir cronograma
    addScheduleBtn.addEventListener('click', function() {
        fetch('../../mvc/controllers/administrator/load_activities.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    activitySelect.innerHTML = '';
                    data.activities.forEach(activity => {
                        const option = document.createElement('option');
                        option.value = activity.id_actividad;
                        option.textContent = activity.nombre_actividad;
                        activitySelect.appendChild(option);
                    });
                } else {
                    console.error('Error al cargar las actividades:', data.message);
                }
            })
            .catch(error => console.error('Error al cargar las actividades:', error));

        fetch('../../mvc/controllers/administrator/fetch_groups.php')
            .then(response => response.json())
            .then(data => {
                console.log(data); // Agregar este log para verificar la respuesta
                if (data.status === "success") {
                    groupSelect.innerHTML = '';
                    data.groups.forEach(group => {
                        const option = document.createElement('option');
                        option.value = group.id_grupo;
                        option.textContent = group.nombre_grupo;
                        groupSelect.appendChild(option);
                    });
                } else {
                    console.error('Error al cargar los grupos:', data.message);
                }
            })
            .catch(error => console.error('Error al cargar los grupos:', error));

        addScheduleModal.classList.add('show');
    });

    // Cerrar el modal de añadir cronograma
    cancelAddScheduleBtn.addEventListener('click', function() {
        addScheduleModal.classList.remove('show');
    });

    // Manejar el envío del formulario de añadir cronograma
    addScheduleForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(addScheduleForm);
        const data = {
            fecha: formData.get('schedule-date'),
            hora_inicio: formData.get('start-time'),
            hora_fin: formData.get('end-time'),
            id_actividad: formData.get('activity-select'),
            id_grupo: formData.get('group-select')
        };

        fetch(`../../mvc/controllers/administrator/add_schedule.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                addScheduleModal.classList.remove('show');
                
            
            } else {
                console.error('Error al añadir el cronograma:', data.message);
            }
        })
        .catch(error => console.error('Error al añadir el cronograma:', error));
    });
});