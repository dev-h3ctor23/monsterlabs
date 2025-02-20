document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const usernameField = document.querySelector('input[type="text"]');
    const passwordField = document.querySelector('input[type="password"]');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    let valid = true;
    
    // Validación para el usuario: no puede estar vacío y solo debe contener letras y números
    const usernameValue = usernameField.value.trim();
    if (usernameValue === "") {
        emailError.textContent = "El campo de usuario es obligatorio.";
        emailError.style.display = 'block';
        usernameField.classList.add('input-error');
        valid = false;
    } else if (!/^[a-zA-Z0-9]+$/.test(usernameValue)) {
        emailError.textContent = "El campo de usuario solo puede contener letras y números.";
        emailError.style.display = 'block';
        usernameField.classList.add('input-error');
        valid = false;
    } else {
        emailError.style.display = 'none';
        usernameField.classList.remove('input-error');
    }
    
    // Validación para la contraseña: no puede estar vacía
    const passwordValue = passwordField.value.trim();
    if (passwordValue === "") {
        passwordError.textContent = "El campo de contraseña es obligatorio.";
        passwordError.style.display = 'block';
        passwordField.classList.add('input-error');
        valid = false;
    } else {
        passwordError.style.display = 'none';
        passwordField.classList.remove('input-error');
    }
    
    if (valid) {
        // Suponiendo que usamos fetch para enviar datos al endpoint de login (por ejemplo, login.php)
        fetch('/monsterlabs/mvc/controllers/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre_usuario: usernameValue,
                contrasena: passwordValue
            })
        })
        .then(response => response.json())
        .then(data => {
            // Limpieza en caso de respuesta exitosa
            emailError.style.display = 'none';
            passwordError.style.display = 'none';
            usernameField.classList.remove('input-error');
            passwordField.classList.remove('input-error');
            
            if (data.error) {
                // Supongamos que el servidor responde "El usuario no existe." para usuario inexistente
                // o "Contraseña incorrecta." para usuario existente pero contraseña errónea
                if (data.error === "El usuario no existe.") {
                    emailError.textContent = data.error;
                    emailError.style.display = 'block';
                    usernameField.classList.add('input-error');
                } else if (data.error === "Contraseña incorrecta.") {
                    passwordError.textContent = data.error;
                    passwordError.style.display = 'block';
                    passwordField.classList.add('input-error');
                }
            } else if (data.message) {
                // Acciones en caso de éxito (ejemplo, redireccionar)
                if (data.message && data.redirect) {
                    window.location = data.redirect;
                } else {
                    window.location = '/monsterlabs/mvc/views/error-404.html';
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

// Evento blur para el campo de usuario
document.querySelector('input[type="text"]').addEventListener('blur', function() {
    const emailError = document.getElementById('email-error');
    const usernameValue = this.value.trim();
    
    if (usernameValue === "") {
        emailError.textContent = "El campo de usuario es obligatorio.";
        emailError.style.display = 'block';
        this.classList.add('input-error');
    } else if (!/^[a-zA-Z0-9]+$/.test(usernameValue)) {
        emailError.textContent = "El campo de usuario solo puede contener letras y números.";
        emailError.style.display = 'block';
        this.classList.add('input-error');
    } else {
        emailError.style.display = 'none';
        this.classList.remove('input-error');
    }
});

// Evento blur para el campo de contraseña
document.querySelector('input[type="password"]').addEventListener('blur', function() {
    const passwordError = document.getElementById('password-error');
    const passwordValue = this.value.trim();
    
    if (passwordValue === "") {
        passwordError.textContent = "El campo de contraseña es obligatorio.";
        passwordError.style.display = 'block';
        this.classList.add('input-error');
    } else {
        passwordError.style.display = 'none';
        this.classList.remove('input-error');
    }
});