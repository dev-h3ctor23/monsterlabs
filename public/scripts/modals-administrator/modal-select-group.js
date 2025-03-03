document.addEventListener('DOMContentLoaded', function() {
    const selectGroupModal = document.getElementById('select-group-modal');
    const selectGroupForm = document.getElementById('select-group-form');
    const groupSelect = document.getElementById('group-select');
    const cancelSelectGroupButton = document.getElementById('cancel-select-group');
    let currentChildId = null;

    // Función para abrir el modal de selección de grupo
    function openSelectGroupModal(childId) {
        currentChildId = childId;
        fetch('../../mvc/controllers/administrator/load_groups.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === "success") {
                    groupSelect.innerHTML = '';
                    data.groups.forEach(group => {
                        const option = document.createElement('option');
                        option.value = group.id_grupo;
                        option.textContent = group.nombre_grupo;
                        groupSelect.appendChild(option);
                    });
                    selectGroupModal.classList.add('show');
                } else {
                    console.error('Error al cargar los grupos:', data.message);
                }
            })
            .catch(error => console.error('Error al cargar los grupos:', error));
    }

    // Cerrar el modal de selección de grupo
    cancelSelectGroupButton.addEventListener('click', function() {
        selectGroupModal.classList.remove('show');
    });

    // Manejar el envío del formulario de selección de grupo
    selectGroupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const selectedGroupId = groupSelect.value;
        fetch(`../../mvc/controllers/administrator/update_child_group.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `child_id=${currentChildId}&group_id=${selectedGroupId}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                selectGroupModal.classList.remove('show');
                alert('Grupo actualizado correctamente.');
            } else {
                console.error('Error al actualizar el grupo:', data.message);
            }
        })
        .catch(error => console.error('Error al actualizar el grupo:', error));
    });

    // Exportar la función para abrir el modal
    window.openSelectGroupModal = openSelectGroupModal;
});