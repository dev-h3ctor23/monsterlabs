// Ajuste de variables con los IDs actuales
const addMonitorForm = document.querySelector('#add-monitor-form');
const monitorUsername = document.getElementById('monitor-username');
const monitorFirstName = document.getElementById('monitor-name');
const monitorLastName = document.getElementById('monitor-surname');
const monitorDni = document.getElementById('monitor-dni');
const monitorPhone = document.getElementById('monitor-phone');
const monitorEmail = document.getElementById('monitor-email');
const monitorPassword = document.getElementById('monitor-password');
const monitorConfirmPassword = document.getElementById('monitor-confirm-password');

// Elementos donde se mostrarán los mensajes de error
const monitorUsernameError = document.getElementById('monitor-username-error');
const monitorFirstNameError = document.getElementById('monitor-name-error');
const monitorLastNameError = document.getElementById('monitor-surname-error');
const monitorDniError = document.getElementById('monitor-dni-error');
const monitorPhoneError = document.getElementById('monitor-phone-error');
const monitorEmailError = document.getElementById('monitor-email-error');
const monitorPasswordError = document.getElementById('monitor-password-error');
const monitorConfirmPasswordError = document.getElementById('monitor-confirm-password-error');

// Función para validar el nombre de usuario
function validateUsername() {
    const username = monitorUsername.value.trim();
    const specialCharRegex = /[^a-zA-Z0-9]/;
    if (username === '') {
        monitorUsernameError.textContent = 'El nombre de usuario no puede estar vacío.';
        monitorUsernameError.style.display = 'block';
        monitorUsername.style.borderColor = 'red';
        return false;
    }
    if (specialCharRegex.test(username)) {
        monitorUsernameError.textContent = 'No se permiten caracteres especiales.';
        monitorUsernameError.style.display = 'block';
        monitorUsername.style.borderColor = 'red';
        return false;
    }
    if (username.length < 6) {
        monitorUsernameError.textContent = 'Debe tener al menos 6 caracteres.';
        monitorUsernameError.style.display = 'block';
        monitorUsername.style.borderColor = 'red';
        return false;
    }
    if (/\s/.test(username)) {
        monitorUsernameError.textContent = 'No se permiten espacios.';
        monitorUsernameError.style.display = 'block';
        monitorUsername.style.borderColor = 'red';
        return false;
    }
    monitorUsernameError.style.display = 'none';
    monitorUsername.style.borderColor = '';
    return true;
}

// Función para validar el nombre
function validateFirstName() {
    const firstName = monitorFirstName.value.trim();
    const specialCharRegex = /[^a-zA-Z]/;
    if (firstName === '') {
        monitorFirstNameError.textContent = 'El nombre no puede estar vacío.';
        monitorFirstNameError.style.display = 'block';
        monitorFirstName.style.borderColor = 'red';
        return false;
    }
    if (/\s/.test(firstName)) {
        monitorFirstNameError.textContent = 'No se permiten espacios.';
        monitorFirstNameError.style.display = 'block';
        monitorFirstName.style.borderColor = 'red';
        return false;
    }
    if (specialCharRegex.test(firstName)) {
        monitorFirstNameError.textContent = 'No se permiten caracteres especiales o números.';
        monitorFirstNameError.style.display = 'block';
        monitorFirstName.style.borderColor = 'red';
        return false;
    }
    monitorFirstNameError.style.display = 'none';
    monitorFirstName.style.borderColor = '';
    return true;
}

// Función para validar el apellido
function validateLastName() {
    const lastName = monitorLastName.value.trim();
    const specialCharRegex = /[^a-zA-Z]/;
    if (lastName === '') {
        monitorLastNameError.textContent = 'El apellido no puede estar vacío.';
        monitorLastNameError.style.display = 'block';
        monitorLastName.style.borderColor = 'red';
        return false;
    }
    if (/\s/.test(lastName)) {
        monitorLastNameError.textContent = 'No se permiten espacios.';
        monitorLastNameError.style.display = 'block';
        monitorLastName.style.borderColor = 'red';
        return false;
    }
    if (specialCharRegex.test(lastName)) {
        monitorLastNameError.textContent = 'No se permiten caracteres especiales o números.';
        monitorLastNameError.style.display = 'block';
        monitorLastName.style.borderColor = 'red';
        return false;
    }
    monitorLastNameError.style.display = 'none';
    monitorLastName.style.borderColor = '';
    return true;
}

// Función para validar el DNI
function validateDni() {
    const dni = monitorDni.value.trim();
    const dniRegex = /^[0-9]{8}[A-Z]$/;
    const specialCharRegex = /[^0-9A-Z]/;
    if (dni === '') {
        monitorDniError.textContent = 'El DNI no puede estar vacío.';
        monitorDniError.style.display = 'block';
        monitorDni.style.borderColor = 'red';
        return false;
    }
    if (/\s/.test(dni)) {
        monitorDniError.textContent = 'No se permiten espacios.';
        monitorDniError.style.display = 'block';
        monitorDni.style.borderColor = 'red';
        return false;
    }
    if (!dniRegex.test(dni)) {
        monitorDniError.textContent = 'Formato: 8 números y 1 letra mayúscula.';
        monitorDniError.style.display = 'block';
        monitorDni.style.borderColor = 'red';
        return false;
    }
    if (specialCharRegex.test(dni)) {
        monitorDniError.textContent = 'No se permiten caracteres especiales.';
        monitorDniError.style.display = 'block';
        monitorDni.style.borderColor = 'red';
        return false;
    }
    monitorDniError.style.display = 'none';
    monitorDni.style.borderColor = '';
    return true;
}

// Función para validar el número de teléfono
function validatePhone() {
    const phone = monitorPhone.value.trim();
    const phoneRegex = /^[0-9]{9}$/;
    const specialCharRegex = /[^0-9]/;
    if (phone === '') {
        monitorPhoneError.textContent = 'El teléfono no puede estar vacío.';
        monitorPhoneError.style.display = 'block';
        monitorPhone.style.borderColor = 'red';
        return false;
    }
    if (/\s/.test(phone)) {
        monitorPhoneError.textContent = 'No se permiten espacios.';
        monitorPhoneError.style.display = 'block';
        monitorPhone.style.borderColor = 'red';
        return false;
    }
    if (specialCharRegex.test(phone)) {
        monitorPhoneError.textContent = 'No se permiten letras ni caracteres especiales.';
        monitorPhoneError.style.display = 'block';
        monitorPhone.style.borderColor = 'red';
        return false;
    }
    if (!phoneRegex.test(phone)) {
        monitorPhoneError.textContent = 'Debe contener 9 números.';
        monitorPhoneError.style.display = 'block';
        monitorPhone.style.borderColor = 'red';
        return false;
    }
    monitorPhoneError.style.display = 'none';
    monitorPhone.style.borderColor = '';
    return true;
}

// Función para validar el correo electrónico
function validateEmail() {
    const email = monitorEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        monitorEmailError.textContent = 'El correo electrónico no puede estar vacío.';
        monitorEmailError.style.display = 'block';
        monitorEmail.style.borderColor = 'red';
        return false;
    }
    if (!emailRegex.test(email)) {
        monitorEmailError.textContent = 'El formato del correo electrónico no es válido.';
        monitorEmailError.style.display = 'block';
        monitorEmail.style.borderColor = 'red';
        return false;
    }
    monitorEmailError.style.display = 'none';
    monitorEmail.style.borderColor = '';
    return true;
}

// Función para validar la contraseña
function validatePassword() {
    const password = monitorPassword.value.trim();
    const uppercaseRegex = /[A-Z]/;
    const specialCharRegex = /[^a-zA-Z0-9]/;
    if (password === '') {
        monitorPasswordError.textContent = 'La contraseña no puede estar vacía.';
        monitorPasswordError.style.display = 'block';
        monitorPassword.style.borderColor = 'red';
        return false;
    }
    if (password.length < 6) {
        monitorPasswordError.textContent = 'La contraseña debe contener mínimo 6 caracteres.';
        monitorPasswordError.style.display = 'block';
        monitorPassword.style.borderColor = 'red';
        return false;
    }
    if (!uppercaseRegex.test(password)) {
        monitorPasswordError.textContent = 'La contraseña debe contener al menos una letra mayúscula.';
        monitorPasswordError.style.display = 'block';
        monitorPassword.style.borderColor = 'red';
        return false;
    }
    if (!specialCharRegex.test(password)) {
        monitorPasswordError.textContent = 'La contraseña debe contener al menos un carácter especial.';
        monitorPasswordError.style.display = 'block';
        monitorPassword.style.borderColor = 'red';
        return false;
    }
    if (/\s/.test(password)) {
        monitorPasswordError.textContent = 'La contraseña no debe contener espacios.';
        monitorPasswordError.style.display = 'block';
        monitorPassword.style.borderColor = 'red';
        return false;
    }
    monitorPasswordError.style.display = 'none';
    monitorPassword.style.borderColor = '';
    return true;
}

// Función para validar la confirmación de la contraseña
function validateConfirmPassword() {
    const password = monitorPassword.value.trim();
    const confirmPassword = monitorConfirmPassword.value.trim();
    if (confirmPassword === '') {
        monitorConfirmPasswordError.textContent = 'Confirmar la contraseña es obligatorio.';
        monitorConfirmPasswordError.style.display = 'block';
        monitorConfirmPassword.style.borderColor = 'red';
        return false;
    }
    if (password !== confirmPassword) {
        monitorConfirmPasswordError.textContent = 'Las contraseñas no coinciden.';
        monitorConfirmPasswordError.style.display = 'block';
        monitorConfirmPassword.style.borderColor = 'red';
        return false;
    }
    monitorConfirmPasswordError.style.display = 'none';
    monitorConfirmPassword.style.borderColor = '';
    return true;
}

// Función para validar el formulario completo
function validateAddMonitorForm() {
    return validateUsername() &&
           validateFirstName() &&
           validateLastName() &&
           validateDni() &&
           validatePhone() &&
           validateEmail() &&
           validatePassword() &&
           validateConfirmPassword();
}

// Agregar eventos de validación a los campos
monitorUsername.onblur = validateUsername;
monitorFirstName.onblur = validateFirstName;
monitorLastName.onblur = validateLastName;
monitorDni.onblur = validateDni;
monitorPhone.onblur = validatePhone;
monitorEmail.onblur = validateEmail;
monitorPassword.onblur = validatePassword;
monitorConfirmPassword.onblur = validateConfirmPassword;

// Agregar evento de submit al formulario
addMonitorForm.addEventListener('submit', function(event) {
    event.preventDefault();
    if (!validateAddMonitorForm()) {
        const error_popup_add = document.getElementById('popup-error-add');
        if (error_popup_add) {
            error_popup_add.textContent = "Por favor, completa correctamente el formulario";
            error_popup_add.classList.add("show");
            error_popup_add.style.background = "#DC3545"; // Rojo
            setTimeout(() => {
                error_popup_add.classList.remove("show");
            }, 1000);
        } else {
            console.error("No se encontró el elemento con id 'popup-error-add'");
        }
    } else {
        const addMonitorModal = document.getElementById('add-monitor-modal');
        addMonitorModal.classList.remove("show");
        const popup = document.getElementById('popup');
        popup.textContent = "Monitor añadido con éxito";
        popup.style.background = "#28A745"; // Verde
        popup.classList.add("show");
        setTimeout(() => {
            popup.classList.remove("show");
        }, 1000);
    }
});