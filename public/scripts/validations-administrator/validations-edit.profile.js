// Ajuste de variables con los IDs actuales
const editProfileForm = document.querySelector('.modal-form');
const editUsername = document.getElementById('username');
const editFirstName = document.getElementById('name');
const editLastName = document.getElementById('surname');
const editDni = document.getElementById('dni');
const editPhone = document.getElementById('phone');
const editEmail = document.getElementById('email');

// Elementos donde se mostrarán los mensajes de error (debes agregarlos en el HTML)
const editUsernameError = document.getElementById('username-error');
const editFirstNameError = document.getElementById('name-error');
const editLastNameError = document.getElementById('surname-error');
const editDniError = document.getElementById('dni-error');
const editPhoneError = document.getElementById('phone-error');
const editEmailError = document.getElementById('email-error');

// Función para validar el nombre de usuario
function validateUsername() {
    const username = editUsername.value.trim();
    const specialCharRegex = /[^a-zA-Z0-9]/;
    if (username === '') {
        editUsernameError.textContent = 'El nombre de usuario no puede estar vacío.';
        editUsernameError.style.display = 'block';
        editUsername.style.borderColor = 'red';
        return false;
    }
    if (specialCharRegex.test(username)) {
        editUsernameError.textContent = 'No se permiten caracteres especiales.';
        editUsernameError.style.display = 'block';
        editUsername.style.borderColor = 'red';
        return false;
    }
    if (username.length < 6) {
        editUsernameError.textContent = 'Debe tener al menos 6 caracteres.';
        editUsernameError.style.display = 'block';
        editUsername.style.borderColor = 'red';
        return false;
    }
    if (/\s/.test(username)) {
        editUsernameError.textContent = 'No se permiten espacios.';
        editUsernameError.style.display = 'block';
        editUsername.style.borderColor = 'red';
        return false;
    }
    editUsernameError.style.display = 'none';
    editUsername.style.borderColor = '';
    return true;
}

// Función para validar el nombre
function validateFirstName() {
    const firstName = editFirstName.value.trim();
    const specialCharRegex = /[^a-zA-Z]/;
    if (firstName === '') {
        editFirstNameError.textContent = 'El nombre no puede estar vacío.';
        editFirstNameError.style.display = 'block';
        editFirstName.style.borderColor = 'red';
        return false;
    }
    if (/\s/.test(firstName)) {
        editFirstNameError.textContent = 'No se permiten espacios.';
        editFirstNameError.style.display = 'block';
        editFirstName.style.borderColor = 'red';
        return false;
    }
    if (specialCharRegex.test(firstName)) {
        editFirstNameError.textContent = 'No se permiten caracteres especiales o números.';
        editFirstNameError.style.display = 'block';
        editFirstName.style.borderColor = 'red';
        return false;
    }
    editFirstNameError.style.display = 'none';
    editFirstName.style.borderColor = '';
    return true;
}

// Función para validar el apellido
function validateLastName() {
    const lastName = editLastName.value.trim();
    const specialCharRegex = /[^a-zA-Z]/;
    if (lastName === '') {
        editLastNameError.textContent = 'El apellido no puede estar vacío.';
        editLastNameError.style.display = 'block';
        editLastName.style.borderColor = 'red';
        return false;
    }
    if (/\s/.test(lastName)) {
        editLastNameError.textContent = 'No se permiten espacios.';
        editLastNameError.style.display = 'block';
        editLastName.style.borderColor = 'red';
        return false;
    }
    if (specialCharRegex.test(lastName)) {
        editLastNameError.textContent = 'No se permiten caracteres especiales o números.';
        editLastNameError.style.display = 'block';
        editLastName.style.borderColor = 'red';
        return false;
    }
    editLastNameError.style.display = 'none';
    editLastName.style.borderColor = '';
    return true;
}

// Función para validar el DNI
function validateDni() {
    const dni = editDni.value.trim();
    const dniRegex = /^[0-9]{8}[A-Z]$/;
    const specialCharRegex = /[^0-9A-Z]/;
    if (dni === '') {
        editDniError.textContent = 'El DNI no puede estar vacío.';
        editDniError.style.display = 'block';
        editDni.style.borderColor = 'red';
        return false;
    }
    if (/\s/.test(dni)) {
        editDniError.textContent = 'No se permiten espacios.';
        editDniError.style.display = 'block';
        editDni.style.borderColor = 'red';
        return false;
    }
    if (!dniRegex.test(dni)) {
        editDniError.textContent = 'Formato: 8 números y 1 letra mayúscula.';
        editDniError.style.display = 'block';
        editDni.style.borderColor = 'red';
        return false;
    }
    if (specialCharRegex.test(dni)) {
        editDniError.textContent = 'No se permiten caracteres especiales.';
        editDniError.style.display = 'block';
        editDni.style.borderColor = 'red';
        return false;
    }
    editDniError.style.display = 'none';
    editDni.style.borderColor = '';
    return true;
}

// Función para validar el número de teléfono
function validatePhone() {
    const phone = editPhone.value.trim();
    const phoneRegex = /^[0-9]{9}$/;
    const specialCharRegex = /[^0-9]/;
    if (phone === '') {
        editPhoneError.textContent = 'El teléfono no puede estar vacío.';
        editPhoneError.style.display = 'block';
        editPhone.style.borderColor = 'red';
        return false;
    }
    if (/\s/.test(phone)) {
        editPhoneError.textContent = 'No se permiten espacios.';
        editPhoneError.style.display = 'block';
        editPhone.style.borderColor = 'red';
        return false;
    }
    if (specialCharRegex.test(phone)) {
        editPhoneError.textContent = 'No se permiten letras ni caracteres especiales.';
        editPhoneError.style.display = 'block';
        editPhone.style.borderColor = 'red';
        return false;
    }
    if (!phoneRegex.test(phone)) {
        editPhoneError.textContent = 'Debe contener 9 números.';
        editPhoneError.style.display = 'block';
        editPhone.style.borderColor = 'red';
        return false;
    }
    editPhoneError.style.display = 'none';
    editPhone.style.borderColor = '';
    return true;
}

// Función para validar el email
function validateEmail() {
    const email = editEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        editEmailError.textContent = 'El email no puede estar vacío.';
        editEmailError.style.display = 'block';
        editEmail.style.borderColor = 'red';
        return false;
    }
    if (!emailRegex.test(email)) {
        editEmailError.textContent = 'El formato del email no es válido.';
        editEmailError.style.display = 'block';
        editEmail.style.borderColor = 'red';
        return false;
    }
    editEmailError.style.display = 'none';
    editEmail.style.borderColor = '';
    return true;
}

// Función para validar el formulario completo
function validateEditProfileForm() {
    return validateUsername() &&
           validateFirstName() &&
           validateLastName() &&
           validateDni() &&
           validatePhone() &&
           validateEmail();
}

// Agregar eventos de validación a los campos
editUsername.onblur = validateUsername;
editFirstName.onblur = validateFirstName;
editLastName.onblur = validateLastName;
editDni.onblur = validateDni;
editPhone.onblur = validatePhone;
editEmail.onblur = validateEmail;

// Agregar evento de submit al formulario
editProfileForm.addEventListener('submit', function(event) {
    if (!validateEditProfileForm()) {
        event.preventDefault();
        const error_popup_edit = document.getElementById('popup-error-edit');
        if (error_popup_edit) {
            error_popup_edit.textContent = "Por favor, completa correctamente el formulario";
            error_popup_edit.classList.add("show");
            setTimeout(() => {
                error_popup_edit.classList.remove("show");
            }, 1000);
        } else {
            console.error("No se encontró el elemento con id 'popup-error-edit'");
        }
        return;
    } else {
        event.preventDefault();
        const editProfileModal = document.getElementById('edit-profile-modal');
        editProfileModal.classList.remove("show");
        const popup = document.getElementById('popup');
        popup.textContent = "Cambios guardados con éxito";
        popup.style.background = "#28A745";
        popup.classList.add("show");
        setTimeout(() => {
            popup.classList.remove("show");
        }, 1000);
    }
});