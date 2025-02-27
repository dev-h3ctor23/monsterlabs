document.addEventListener('DOMContentLoaded', function() {
    fetch('../../mvc/controllers/administrator/load_active_children.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const childrenTableBody = document.getElementById('children-table-body');
                data.children.forEach(child => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="child-cell">
                            <span class="name">${child.nombre} ${child.apellido}</span>
                            <button class="btn-yellow"></button>
                        </td>
                    `;
                    childrenTableBody.appendChild(row);
                });
            } else {
                console.error('Error al cargar los niños activos:', data.message);
            }
        })
        .catch(error => console.error('Error al cargar los niños activos:', error));
});