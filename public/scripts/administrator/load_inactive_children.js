document.addEventListener('DOMContentLoaded', function() {
    fetch('../../mvc/controllers/administrator/get_inactive_children.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const tableBody = document.getElementById('inactive-children-table-body');
                data.children.forEach(child => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="inactive-child-cell">
                            <span class="name">${child.nombre} ${child.apellido}</span>
                            <div class="actions">
                                <button id="btn-green-${child.id_nino}" class="btn-action btn-green unique-btn"></button>
                                <button id="btn-yellow-${child.id_nino}" class="btn-action btn-yellow unique-btn"></button>
                                <button id="btn-red-${child.id_nino}" class="btn-action btn-red unique-btn"></button>
                            </div>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                // Añadir eventos de clic a los botones verdes después de que se hayan agregado al DOM
                document.querySelectorAll('.btn-green').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const selectedChildId = event.target.id.split('-')[2]; // Obtener el ID del niño del botón
                        const altaModal = document.getElementById('confirm-alta-modal');
                        altaModal.classList.add('show');
                    });
                });

                // Añadir eventos de clic a los botones amarillos después de que se hayan agregado al DOM
                document.querySelectorAll('.btn-yellow').forEach(button => {
                    button.addEventListener('click', (event) => {
                        console.log('Yellow button clicked');
                        const row = event.target.closest('tr');
                        console.log('Row found:', row);
                        const childName = row.querySelector('.name').textContent.trim();
                        console.log('Child name:', childName);
                        const childSurname = 'Apellido'; // Reemplaza con el apellido real
                        console.log('Child surname:', childSurname);
                        const childDob = '01/01/2010'; // Reemplaza con la fecha de nacimiento real
                        console.log('Child DOB:', childDob);
                        const parentName = 'Nombre del Padre'; // Reemplaza con el nombre real del padre
                        console.log('Parent name:', parentName);
                        const parentSurname = 'Apellido del Padre'; // Reemplaza con el apellido real del padre
                        console.log('Parent surname:', parentSurname);
                        const parentEmail = 'padre@ejemplo.com'; // Reemplaza con el correo electrónico real del padre
                        console.log('Parent email:', parentEmail);

                        document.getElementById('child-name').textContent = childName;
                        document.getElementById('child-surname').textContent = childSurname;
                        document.getElementById('child-dob').textContent = childDob;
                        document.getElementById('parent-name').textContent = parentName;
                        document.getElementById('parent-surname').textContent = parentSurname;
                        document.getElementById('parent-email').textContent = parentEmail;

                        const viewChildModal = document.getElementById('view-child-modal');
                        viewChildModal.classList.add('show');
                        console.log('View child modal should be shown now');
                    });
                });
            } else {
                console.error(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
});