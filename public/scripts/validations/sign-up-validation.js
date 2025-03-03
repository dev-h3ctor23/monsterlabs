document.getElementById('sign-up-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    
    const usernameErrorLength = document.getElementById('username-error-length');
    const usernameErrorContent = document.getElementById('username-error-content');
    const usernameExistsError = document.getElementById('username-exists-error');
    const passwordErrorLength = document.getElementById('password-error-length');
    const passwordErrorUppercase = document.getElementById('password-error-uppercase');
    const passwordErrorLowercase = document.getElementById('password-error-lowercase');
    const passwordErrorNumber = document.getElementById('password-error-number');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const formError = document.getElementById('form-error');
    
    const usernameLengthRegex = /^.{6,10}$/;
    const usernameContentRegex = /^[a-zA-Z0-9]+$/;
    const passwordLengthRegex = /^.{6,}$/;
    const passwordUppercaseRegex = /^(?=.*[A-Z])/;
    const passwordLowercaseRegex = /^(?=.*[a-z])/;
    const passwordNumberRegex = /^(?=.*\d)/;
    
    let isValid = true;
    
    // Validar que todos los campos estén completos
    if (!username || !password || !confirmPassword) {
        if (!username) {
            usernameErrorLength.textContent = 'El campo de usuario es obligatorio.';
            usernameErrorLength.style.display = 'block';
            usernameErrorContent.style.display = 'none';
            document.getElementById('username').classList.add('input-error');
        } else {
            usernameErrorLength.style.display = 'none';
            document.getElementById('username').classList.remove('input-error');
        }
        
        if (!password) {
            passwordErrorLength.textContent = 'El campo de contraseña es obligatorio.';
            passwordErrorLength.style.display = 'block';
            document.getElementById('password').classList.add('input-error');
        } else {
            passwordErrorLength.style.display = 'none';
            document.getElementById('password').classList.remove('input-error');
        }
        
        if (!confirmPassword) {
            confirmPasswordError.textContent = 'Es obligatorio confirmar la contraseña.';
            confirmPasswordError.style.display = 'block';
            document.getElementById('confirm-password').classList.add('input-error');
        } else {
            confirmPasswordError.style.display = 'none';
            document.getElementById('confirm-password').classList.remove('input-error');
        }
        
        isValid = false;
    }
    
    // Validar el nombre de usuario
    if (username) {
        if (!usernameLengthRegex.test(username)) {
            usernameErrorLength.textContent = 'El nombre de usuario debe tener entre 6 y 10 caracteres.';
            usernameErrorLength.style.display = 'block';
            document.getElementById('username').classList.add('input-error');
            isValid = false;
        } else {
            usernameErrorLength.style.display = 'none';
            document.getElementById('username').classList.remove('input-error');
        }
        
        if (!usernameContentRegex.test(username)) {
            usernameErrorContent.textContent = 'El nombre de usuario solo puede contener letras y números.';
            usernameErrorContent.style.display = 'block';
            document.getElementById('username').classList.add('input-error');
            isValid = false;
        } else {
            usernameErrorContent.style.display = 'none';
            document.getElementById('username').classList.remove('input-error');
        }
    }
    
    // Validar la contraseña
    if (password) {
        if (!passwordLengthRegex.test(password)) {
            passwordErrorLength.textContent = 'La contraseña debe tener al menos 6 caracteres.';
            passwordErrorLength.style.display = 'block';
            document.getElementById('password').classList.add('input-error');
            isValid = false;
        } else {
            passwordErrorLength.style.display = 'none';
            document.getElementById('password').classList.remove('input-error');
        }
        
        if (!passwordUppercaseRegex.test(password)) {
            passwordErrorUppercase.textContent = 'La contraseña debe incluir al menos una letra mayúscula.';
            passwordErrorUppercase.style.display = 'block';
            document.getElementById('password').classList.add('input-error');
            isValid = false;
        } else {
            passwordErrorUppercase.style.display = 'none';
            document.getElementById('password').classList.remove('input-error');
        }
        
        if (!passwordLowercaseRegex.test(password)) {
            passwordErrorLowercase.textContent = 'La contraseña debe incluir al menos una letra minúscula.';
            passwordErrorLowercase.style.display = 'block';
            document.getElementById('password').classList.add('input-error');
            isValid = false;
        } else {
            passwordErrorLowercase.style.display = 'none';
            document.getElementById('password').classList.remove('input-error');
        }
        
        if (!passwordNumberRegex.test(password)) {
            passwordErrorNumber.textContent = 'La contraseña debe incluir al menos un número.';
            passwordErrorNumber.style.display = 'block';
            document.getElementById('password').classList.add('input-error');
            isValid = false;
        } else {
            passwordErrorNumber.style.display = 'none';
            document.getElementById('password').classList.remove('input-error');
        }
    }
    
    // Validar que las contraseñas coincidan
    if (confirmPassword === '') {
        confirmPasswordError.textContent = 'Es obligatorio confirmar la contraseña.';
        confirmPasswordError.style.display = 'block';
        document.getElementById('confirm-password').classList.add('input-error');
        isValid = false;
    } else if (password !== confirmPassword) {
        confirmPasswordError.textContent = 'Las contraseñas no coinciden.';
        confirmPasswordError.style.display = 'block';
        document.getElementById('confirm-password').classList.add('input-error');
        isValid = false;
    } else {
        confirmPasswordError.style.display = 'none';
        document.getElementById('confirm-password').classList.remove('input-error');
    }
    
    if (isValid) {
        // Deshabilitar el botón de envío para evitar múltiples envíos
        const submitButton = document.getElementById('sign-up-form').querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            submitButton.classList.add('button-enviando'); // Añadir la clase CSS
        }
        
        // Enviar los datos del formulario usando fetch
        const data = {
            nombre_usuario: username,
            contrasena: password
        };

        fetch('/monsterlabs/mvc/controllers/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                const successMessage = document.getElementById('success-message');
                successMessage.textContent = data.message;
                successMessage.style.display = 'block';
                // Rehabilitar el botón de envío en caso de éxito
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Registrar';
                    submitButton.classList.remove('button-enviando'); // Quitar la clase CSS
                }
                // Redirigir o realizar alguna acción adicional en caso de éxito
            } else if (data.error) {
                if (data.error === "El nombre de usuario ya está en uso.") {
                    usernameExistsError.textContent = data.error;
                    usernameExistsError.style.display = 'block';
                    document.getElementById('username').classList.add('input-error');
                } else {
                    alert(data.error);
                }
                // Rehabilitar el botón de envío en caso de error
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Registrar';
                    submitButton.classList.remove('button-enviando'); // Quitar la clase CSS
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Rehabilitar el botón de envío en caso de error
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Registrar';
                submitButton.classList.remove('button-enviando'); // Quitar la clase CSS
            }
        });
    }
});

// Añadir listeners onblur para validaciones individuales
document.getElementById('username').addEventListener('blur', function() {
    const username = this.value.trim();
    const usernameErrorLength = document.getElementById('username-error-length');
    const usernameErrorContent = document.getElementById('username-error-content');
    
    if (!username) {
        usernameErrorLength.textContent = 'El campo de usuario es obligatorio.';
        usernameErrorLength.style.display = 'block';
        usernameErrorContent.style.display = 'none';
        this.classList.add('input-error');
    } else if (!/^.{6,10}$/.test(username)) {
        usernameErrorLength.textContent = 'El nombre de usuario debe tener entre 6 y 10 caracteres.';
        usernameErrorLength.style.display = 'block';
        this.classList.add('input-error');
    } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
        usernameErrorContent.textContent = 'El nombre de usuario solo puede contener letras y números.';
        usernameErrorContent.style.display = 'block';
        this.classList.add('input-error');
    } else {
        usernameErrorLength.style.display = 'none';
        usernameErrorContent.style.display = 'none';
        this.classList.remove('input-error');
    }
});

document.getElementById('password').addEventListener('blur', function() {
    const password = this.value.trim();
    const passwordErrorLength = document.getElementById('password-error-length');
    const passwordErrorUppercase = document.getElementById('password-error-uppercase');
    const passwordErrorLowercase = document.getElementById('password-error-lowercase');
    const passwordErrorNumber = document.getElementById('password-error-number');
    
    if (!password) {
        passwordErrorLength.textContent = 'El campo de contraseña es obligatorio.';
        passwordErrorLength.style.display = 'block';
        this.classList.add('input-error');
    } else if (!/^.{6,}$/.test(password)) {
        passwordErrorLength.textContent = 'La contraseña debe tener al menos 6 caracteres.';
        passwordErrorLength.style.display = 'block';
        this.classList.add('input-error');
    } else if (!/^(?=.*[A-Z])/.test(password)) {
        passwordErrorUppercase.textContent = 'La contraseña debe incluir al menos una letra mayúscula.';
        passwordErrorUppercase.style.display = 'block';
        this.classList.add('input-error');
    } else if (!/^(?=.*[a-z])/.test(password)) {
        passwordErrorLowercase.textContent = 'La contraseña debe incluir al menos una letra minúscula.';
        passwordErrorLowercase.style.display = 'block';
        this.classList.add('input-error');
    } else if (!/^(?=.*\d)/.test(password)) {
        passwordErrorNumber.textContent = 'La contraseña debe incluir al menos un número.';
        passwordErrorNumber.style.display = 'block';
        this.classList.add('input-error');
    } else {
        passwordErrorLength.style.display = 'none';
        passwordErrorUppercase.style.display = 'none';
        passwordErrorLowercase.style.display = 'none';
        passwordErrorNumber.style.display = 'none';
        this.classList.remove('input-error');
    }
});

document.getElementById('confirm-password').addEventListener('blur', function() {
    const confirmPassword = this.value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPasswordError = document.getElementById('confirm-password-error');
    
    if (!confirmPassword) {
        confirmPasswordError.textContent = 'Es obligatorio confirmar la contraseña.';
        confirmPasswordError.style.display = 'block';
        this.classList.add('input-error');
    } else if (password !== confirmPassword) {
        confirmPasswordError.textContent = 'Las contraseñas no coinciden.';
        confirmPasswordError.style.display = 'block';
        this.classList.add('input-error');
    } else {
        confirmPasswordError.style.display = 'none';
        this.classList.remove('input-error');
    }
});