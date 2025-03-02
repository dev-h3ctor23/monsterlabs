document.addEventListener('DOMContentLoaded', function() {
    const confirmDeleteGroupModal = document.getElementById('confirm-delete-group-modal');
    const confirmDeleteGroupBtn = document.getElementById('confirm-delete-group');
    let groupIdToDelete = null;
    let rowToDelete = null;

    fetch('../../mvc/controllers/administrator/get_groups.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const groupsTableBody = document.getElementById('groups-table-body');
                data.groups.forEach(group => {
                    const newRow = document.createElement('tr');
                    const newCell = document.createElement('td');
                    newCell.textContent = group.nombre_grupo;
                    newRow.appendChild(newCell);

                    // Crear botón de eliminación
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Eliminar';
                    deleteBtn.classList.add('btn', 'btn-delete');
                    deleteBtn.style.backgroundColor = 'red';
                    deleteBtn.addEventListener('click', function() {
                        groupIdToDelete = group.id_grupo; // Asigna el ID del grupo a eliminar
                        rowToDelete = newRow; // Asigna la fila a eliminar
                        confirmDeleteGroupModal.classList.add('show');
                    });
                    newRow.appendChild(deleteBtn);

                    groupsTableBody.appendChild(newRow);
                });
            } else {
                console.error('Error al cargar los grupos:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
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
});