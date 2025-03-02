document.addEventListener('DOMContentLoaded', function() {
    const addGroupBtn = document.getElementById('add-group-btn');
    const addGroupModal = document.getElementById('add-group-modal');
    const cancelAddGroupBtn = document.getElementById('cancel-add-group');
    const addGroupForm = document.getElementById('add-group-form');
    const groupNameInput = document.getElementById('group-name');
    const groupNameError = document.getElementById('group-name-error');
    const confirmDeleteGroupModal = document.getElementById('confirm-delete-group-modal');
    const confirmDeleteGroupBtn = document.getElementById('confirm-delete-group');
    let groupIdToDelete = null;
    let rowToDelete = null;

    if (addGroupBtn && addGroupModal && cancelAddGroupBtn && addGroupForm && groupNameInput && groupNameError) {
        addGroupBtn.addEventListener('click', function() {
            addGroupModal.classList.add('show');
        });

        cancelAddGroupBtn.addEventListener('click', function() {
            addGroupModal.classList.remove('show');
            addGroupForm.reset(); // Restaurar el formulario
            groupNameError.textContent = ''; // Limpiar mensajes de error
            groupNameInput.style.borderColor = ''; // Restaurar el estilo del borde
        });

        addGroupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const groupName = groupNameInput.value.trim();

            if (groupName === '') {
                groupNameError.textContent = 'El nombre del grupo no puede estar vacío.';
                groupNameError.style.display = 'block';
                groupNameInput.style.borderColor = 'red';
            } else {
                groupNameError.style.display = 'none';
                groupNameInput.style.borderColor = '';

                // Enviar el nombre del grupo al servidor
                fetch('../../mvc/controllers/administrator/add_group.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `group_name=${encodeURIComponent(groupName)}`
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        // Añadir el grupo a la tabla
                        const groupsTableBody = document.getElementById('groups-table-body');
                        const newRow = document.createElement('tr');
                        const newCell = document.createElement('td');
                        newCell.textContent = groupName;
                        newRow.appendChild(newCell);

                        // Crear botón de eliminación
                        const deleteBtn = document.createElement('button');
                        deleteBtn.textContent = 'Eliminar';
                        deleteBtn.classList.add('btn', 'btn-delete');
                        deleteBtn.style.backgroundColor = 'red';
                        deleteBtn.addEventListener('click', function() {
                            groupIdToDelete = data.group_id; // Asigna el ID del grupo a eliminar
                            rowToDelete = newRow; // Asigna la fila a eliminar
                            confirmDeleteGroupModal.classList.add('show');
                        });
                        newRow.appendChild(deleteBtn);

                        groupsTableBody.appendChild(newRow);

                        // Cerrar el modal
                        addGroupModal.classList.remove('show');

                        // Restaurar el formulario
                        addGroupForm.reset();
                        groupNameError.textContent = '';
                        groupNameInput.style.borderColor = '';
                    } else {
                        // Mostrar mensaje de error
                        groupNameError.textContent = data.message;
                        groupNameError.style.display = 'block';
                        groupNameInput.style.borderColor = 'red';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    groupNameError.textContent = 'Error al añadir el grupo';
                    groupNameError.style.display = 'block';
                    groupNameInput.style.borderColor = 'red';
                });
            }
        });

        confirmDeleteGroupBtn.addEventListener('click', function() {
            if (groupIdToDelete) {
                // Enviar solicitud para eliminar el grupo
                fetch(`../../mvc/controllers/administrator/delete_group.php?id=${groupIdToDelete}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        // Eliminar la fila del grupo de la tabla
                        rowToDelete.remove();

                        // Cerrar el modal de confirmación
                        confirmDeleteGroupModal.classList.remove('show');
                        groupIdToDelete = null;
                        rowToDelete = null;
                    } else {
                        console.error('Error al eliminar el grupo');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        });

        document.getElementById('cancel-delete-group').addEventListener('click', function() {
            confirmDeleteGroupModal.classList.remove('show');
            groupIdToDelete = null;
            rowToDelete = null;
        });
    }
});