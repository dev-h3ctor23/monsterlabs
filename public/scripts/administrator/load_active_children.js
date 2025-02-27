document.addEventListener('DOMContentLoaded', function() {
    fetch('../../mvc/controllers/administrator/get_active_children.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const tableBody = document.getElementById('active-children-table-body');
                data.children.forEach(child => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="active-child-cell">
                            <span class="name">${child.nombre} ${child.apellido}</span>
                            <div class="actions">
                                <button id="btn-yellow-${child.id_nino}" class="btn-action btn-yellow unique-btn"></button>
                                <button id="btn-red-${child.id_nino}" class="btn-action btn-red unique-btn" data-active="1"></button>
                            </div>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                // Función para el botón amarillo (misma que antes)
                document.querySelectorAll('.btn-yellow').forEach(button => {
                    button.addEventListener('click', (event) => {
                        console.log('Yellow button clicked');
                        const row = event.target.closest('tr');
                        const childName = row.querySelector('.name').textContent.trim();
                        document.getElementById('child-name').textContent = childName;
                        document.getElementById('view-child-modal').classList.add('show');
                    });
                });

                // (Ya no asignamos listener extra al btn-red acá,
                // ya que el modal-confirm-baja.js se encargará)
            } else {
                console.error(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
});

// Dentro del .then(data => { ... } ) del confirmBajaBtn:
if (data.status === "success") {
    showPopup("Participante dado de baja", "success");
    // Buscar la fila en la tabla de niños activos
    const redButton = document.getElementById(`btn-red-${childId}`);
    if (redButton) {
        const row = redButton.closest("tr");
        // Aplicar clase para animación de desvanecido
        row.classList.add('fade-out');
        setTimeout(() => {
            // Remover la fila de la tabla activa
            row.remove();
            
            // Clonar la fila para poder modificar su contenido sin conservar los listeners previos
            const newRow = row.cloneNode(true);
            // Actualizar el innerHTML de la nueva fila para que coincida con el marcado de niños inactivos
            // Por ejemplo, se sustituye la clase de la celda, y se restauran los tres botones (verde, amarillo y rojo)
            // sin el atributo data-active, ya que son los propios de la tabla de inactivos.
            newRow.innerHTML = `
                <td class="inactive-child-cell">
                    <span class="name">${newRow.querySelector('.name').textContent}</span>
                    <div class="actions">
                        <button id="btn-green-${childId}" class="btn-action btn-green unique-btn"></button>
                        <button id="btn-yellow-${childId}" class="btn-action btn-yellow unique-btn"></button>
                        <button id="btn-red-${childId}" class="btn-action btn-red unique-btn"></button>
                    </div>
                </td>
            `;
            // Remover clase de fade-out y agregar 'fade-in' para animación de aparición
            newRow.classList.remove('fade-out');
            newRow.classList.add('fade-in');
            
            // Insertar la nueva fila en la tabla de inactivos
            const inactiveTableBody = document.getElementById('inactive-children-table-body');
            inactiveTableBody.appendChild(newRow);
            
            // Quitar la clase fade-in después de que termine la animación
            setTimeout(() => {
                newRow.classList.remove('fade-in');
            }, 350);
        }, 350);
    }
} else {
    showPopup("Error al dar de baja: " + data.message, "error");
}