document.addEventListener('DOMContentLoaded', function() {
    // Cargar los datos de los monitores al cargar la página
    fetch('../../mvc/controllers/administrator/get_monitors.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const monitorTable = document.getElementById('monitors-table-body');
                data.monitors.forEach(monitor => {
                    const newRow = document.createElement('tr');
                    newRow.dataset.monitorId = monitor.id_usuario;
                    newRow.classList.add('fade-in'); // Añadir clase de animación
                    newRow.innerHTML = `
                        <td class="name">
                            ${monitor.nombre} ${monitor.apellido}
                            <div class="actions">
                                <button class="btn-action btn-delete-monitor">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                                        <style>@keyframes rotate-tr{0%{transform:rotate(0)}to{transform:rotate(20deg)}}</style>
                                        <path fill="#f8f8f8" d="M16.773 10.083a.75.75 0 00-1.49-.166l1.49.166zm-1.535 7.027l.745.083-.745-.083zm-6.198 0l-.745.083.745-.083zm-.045-7.193a.75.75 0 00-1.49.166l1.49-.166zm5.249 7.333h-4.21v1.5h4.21v-1.5zm1.038-7.333l-.79 7.11 1.491.166.79-7.11-1.49-.166zm-5.497 7.11l-.79-7.11-1.49.166.79 7.11 1.49-.165zm.249.223a.25.25 0 01-.249-.222l-1.49.165a1.75 1.75 0 001.739 1.557v-1.5zm4.21 1.5c.892 0 1.64-.67 1.74-1.557l-1.492-.165a.25.25 0 01-.248.222v1.5z"/>
                                        <path fill="#f8f8f8" fill-rule="evenodd" d="M11 6a1 1 0 00-1 1v.25H7a.75.75 0 000 1.5h10a.75.75 0 000-1.5h-3V7a1 1 0 00-1-1h-2z" clip-rule="evenodd" style="animation:rotate-tr 1s cubic-bezier(1,-.28,.01,1.13) infinite alternate-reverse both;transform-origin:right center"/>
                                    </svg>
                                </button>
                            </div>
                        </td>
                    `;
                    monitorTable.appendChild(newRow);
                });

                // Añadir eventos de clic a los botones de eliminar monitor
                window.addDeleteMonitorEventListeners();
            } else {
                console.error(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
});

// Abrir el modal de añadir monitor
document.getElementById('add-monitor-btn').addEventListener('click', function() {
    document.getElementById('add-monitor-modal').classList.add('show');
});

// Cerrar el modal de añadir monitor
document.getElementById('cancel-add-monitor').addEventListener('click', function() {
    resetForm();
    document.getElementById('add-monitor-modal').classList.remove('show');
});

// Guardar el monitor al hacer click en "Guardar"
document.getElementById('save-add-monitor').addEventListener('click', function(event) {
    event.preventDefault();

    const monitorData = {
        username: document.getElementById('monitor-username').value,
        name: document.getElementById('monitor-name').value,
        surname: document.getElementById('monitor-surname').value,
        dni: document.getElementById('monitor-dni').value,
        phone: document.getElementById('monitor-phone').value,
        email: document.getElementById('monitor-email').value,
        password: document.getElementById('monitor-password').value
    };

    fetch('../../mvc/controllers/administrator/add_monitor.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(monitorData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            // Actualizar la tabla de monitores con el nuevo monitor
            const monitorTable = document.getElementById('monitors-table-body');
            const newRow = document.createElement('tr');
            newRow.dataset.monitorId = data.monitor.id_usuario;
            newRow.classList.add('fade-in'); // Añadir clase de animación
            newRow.innerHTML = `
                <td class="name">
                    ${data.monitor.nombre} ${data.monitor.apellido}
                    <div class="actions">
                        <button class="btn-action btn-delete-monitor">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                                <style>@keyframes rotate-tr{0%{transform:rotate(0)}to{transform:rotate(20deg)}}</style>
                                <path fill="#f8f8f8" d="M16.773 10.083a.75.75 0 00-1.49-.166l1.49.166zm-1.535 7.027l.745.083-.745-.083zm-6.198 0l-.745.083.745-.083zm-.045-7.193a.75.75 0 00-1.49.166l1.49-.166zm5.249 7.333h-4.21v1.5h4.21v-1.5zm1.038-7.333l-.79 7.11 1.491.166.79-7.11-1.49-.166zm-5.497 7.11l-.79-7.11-1.49.166.79 7.11 1.49-.165zm.249.223a.25.25 0 01-.249-.222l-1.49.165a1.75 1.75 0 001.739 1.557v-1.5zm4.21 1.5c.892 0 1.64-.67 1.74-1.557l-1.492-.165a.25.25 0 01-.248.222v1.5z"/>
                                <path fill="#f8f8f8" fill-rule="evenodd" d="M11 6a1 1 0 00-1 1v.25H7a.75.75 0 000 1.5h10a.75.75 0 000-1.5h-3V7a1 1 0 00-1-1h-2z" clip-rule="evenodd" style="animation:rotate-tr 1s cubic-bezier(1,-.28,.01,1.13) infinite alternate-reverse both;transform-origin:right center"/>
                            </svg>
                        </button>
                    </div>
                </td>
            `;
            monitorTable.appendChild(newRow);

            // Añadir evento de clic al nuevo botón de eliminar monitor
            window.addDeleteMonitorEventListeners();

            // Cerrar el modal y mostrar el popup de éxito
            resetForm();
            document.getElementById('add-monitor-modal').classList.remove('show');
            const popup = document.getElementById('popup');
            popup.textContent = "Monitor añadido con éxito";
            popup.style.background = "#28A745"; // Verde
            popup.classList.add("show");
            setTimeout(() => {
                popup.classList.remove('show');
            }, 1000);
        } else {
            // Mostrar mensajes de error específicos
            if (data.message === "El nombre de usuario ya existe") {
                monitorUsernameError.textContent = data.message;
                monitorUsernameError.style.display = 'block';
                monitorUsername.style.borderColor = 'red';
            } else if (data.message === "El correo electrónico ya existe") {
                monitorEmailError.textContent = data.message;
                monitorEmailError.style.display = 'block';
                monitorEmail.style.borderColor = 'red';
            } else if (data.message === "El DNI ya existe") {
                monitorDniError.textContent = data.message;
                monitorDniError.style.display = 'block';
                monitorDni.style.borderColor = 'red';
            } else {
                console.error(data.message);
            }
        }
    })
    .catch(error => console.error('Error:', error));
});

// Función para abrir el modal de confirmación de eliminación
function openDeleteMonitorModal(event) {
    const deleteMonitorModal = document.getElementById('confirm-delete-monitor-modal');
    const monitorIdToDelete = event.target.closest('tr').dataset.monitorId;
    console.log(`Abriendo modal para eliminar monitor con ID: ${monitorIdToDelete}`);
    deleteMonitorModal.classList.add('show');
    deleteMonitorModal.dataset.monitorIdToDelete = monitorIdToDelete;
}

// Función para restablecer el formulario y los mensajes de error
function resetForm() {
    document.getElementById('add-monitor-form').reset();
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(errorMessage => {
        errorMessage.style.display = 'none';
    });

    const formFields = document.querySelectorAll('.modal-form input');
    formFields.forEach(field => {
        field.style.borderColor = '';
    });
}