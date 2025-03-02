document.addEventListener('DOMContentLoaded', () => {
    const editProfileModal = document.getElementById('edit-profile-modal');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const saveEditBtn = document.getElementById('save-edit');

    let originalData = {};

    // Función para restablecer los mensajes de error y los estilos de los campos
    function resetFormValidation() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(errorMessage => {
            errorMessage.style.display = 'none';
        });

        const formFields = document.querySelectorAll('.modal-form input');
        formFields.forEach(field => {
            field.style.borderColor = '';
        });
    }

    // Abrir modal al hacer click en "Editar perfil"
    editProfileBtn.addEventListener('click', () => {
        fetch('../../mvc/controllers/administrator/administrador.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    const userInfo = data.usuario;
                    const adminInfo = data.administrador;

                    originalData = {
                        username: userInfo.username,
                        name: adminInfo.nombre,
                        surname: adminInfo.apellido,
                        dni: adminInfo.dni,
                        phone: adminInfo.telefono,
                        email: userInfo.email
                    };

                    document.getElementById('username').value = originalData.username || '';
                    document.getElementById('name').value = originalData.name || '';
                    document.getElementById('surname').value = originalData.surname || '';
                    document.getElementById('dni').value = originalData.dni || '';
                    document.getElementById('phone').value = originalData.phone || '';
                    document.getElementById('email').value = originalData.email || '';
                } else {
                    console.error(data.message);
                }
            })
            .catch(error => console.error('Error:', error));

        editProfileModal.classList.add('show');
    });

    // Cerrar el modal al hacer click en "Cancelar" y restablecer los campos
    cancelEditBtn.addEventListener('click', () => {
        document.getElementById('username').value = originalData.username || '';
        document.getElementById('name').value = originalData.name || '';
        document.getElementById('surname').value = originalData.surname || '';
        document.getElementById('dni').value = originalData.dni || '';
        document.getElementById('phone').value = originalData.phone || '';
        document.getElementById('email').value = originalData.email || '';

        resetFormValidation();
        editProfileModal.classList.remove('show');
    });

    // Guardar cambios al hacer click en "Guardar cambios"
    saveEditBtn.addEventListener('click', (event) => {
        event.preventDefault();

        const updatedData = {
            username: document.getElementById('username').value,
            name: document.getElementById('name').value,
            surname: document.getElementById('surname').value,
            dni: document.getElementById('dni').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value
        };

        fetch('../../mvc/controllers/administrator/update_administrador.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                // Actualizar los elementos HTML con los nuevos datos
                document.getElementById("username-display").textContent = updatedData.username;
                document.getElementById("name-display").textContent = `${updatedData.name} ${updatedData.surname}`;
                document.getElementById("email-display").textContent = updatedData.email;
                document.getElementById("phone-display").textContent = updatedData.phone;

                editProfileModal.classList.remove('show');
                const popup = document.getElementById('popup');
                popup.textContent = "Cambios guardados con éxito";
                popup.style.background = "#28A745";
                popup.classList.add("show");
                setTimeout(() => {
                    popup.classList.remove("show");
                }, 1000);
            } else {
                console.error(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});