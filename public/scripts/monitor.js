fetch('/monsterlabs/components/sidebar-monitor.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('sidebar-component').innerHTML = data;

        // Cargar el script del sidebar
        const script = document.createElement('script');
        script.src = '/monsterlabs/public/scripts/script-sidebar.js';
        document.body.appendChild(script);

        // Esperar a que el sidebar se haya insertado antes de buscar elementos
        const menuBtn = document.getElementById("menuBtn");
        const sidebar = document.getElementById("sidebar-component");
        const content = document.getElementById("content");
        const menuLinks = document.querySelectorAll(".sidebar a[data-section]");
        const sections = document.querySelectorAll(".section");

        // if (!menuBtn) {
        //     console.error("ERROR: No se encontró el botón del menú después de cargar el sidebar.");
        //     return;
        // }

        // Evento para abrir/cerrar sidebar
        menuBtn.addEventListener("click", function () {
            sidebar.classList.toggle("expanded");
            document.body.classList.toggle("sidebar-expanded"); //
        });



    // Iterar sobre cada enlace
    menuLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Evitar la recarga de la página

            // Primero, ocultamos todas las secciones
            sections.forEach(section => {
                section.classList.remove("active");
            });

            // Ahora, mostramos solo la sección correspondiente
            const sectionId = link.getAttribute("data-section");
            const activeSection = document.getElementById(sectionId);
            if (activeSection) {
                activeSection.classList.add("active");
            }
        });
    });

        console.log("Sidebar y eventos cargados correctamente.");
    })
    .catch(error => console.error('Error al cargar el componente:', error));


    // Función para obtener los datos del monitor
function obtenerDatosMonitor() {
    fetch('/monsterlabs/mvc/controllers/monitor.php', {
        method: 'GET',  // O puede ser 'POST' si necesitas enviar datos (en este caso, usaremos GET)
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json()) // Convertimos la respuesta a JSON
    .then(data => {
        // Comprobamos si la respuesta es correcta
        if (data.status === "success") {
            // Mostrar los datos del usuario y monitor en el HTML
            document.getElementById("name-monitor").innerHTML =data.monitor.nombre
            document.getElementById("lastname").innerHTML =data.monitor.apellido
            document.getElementById("user-monitor").innerHTML =data.usuario.username
            document.getElementById("dni-monitor").innerHTML =data.monitor.dni
            document.getElementById("email-monitor").innerHTML =data.usuario.email
            document.getElementById("phone-monitor").innerHTML =data.monitor.telefono

            document.getElementById('editEmail').value = data.usuario.email;
            document.getElementById('editPhone').value = data.monitor.telefono;
        } else {
            alert(data.message); // Mostrar el error si no se obtuvieron datos correctamente
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un problema al obtener los datos.");
    });
}

// Llamamos a la función cuando se cargue la página
document.addEventListener("DOMContentLoaded", function() {
    obtenerDatosMonitor();
});




// --------------------ACTUALIZAR DATOS--------------------
// Elementos del DOM
const editProfileBtn = document.getElementById('editProfileBtn');
const perfilInfo = document.getElementById('perfilContainer');
const editProfileSection = document.getElementById('editProfileSection');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const editProfileForm = document.getElementById('editProfileForm');

// Mostrar solo el formulario de editar perfil y ocultar la sección
editProfileBtn.addEventListener('click', function() {
    perfilInfo.style.display = 'none'; // Ocultar la sección de perfil
    editProfileSection.style.display = 'block'; // Mostrar el formulario de edición

    
});

// Cancelar la edición y ocultar el formulario, mostrando nuevamente la sección de perfil
cancelEditBtn.addEventListener('click', function() {
    perfilInfo.style.display = 'block'; // Mostrar la sección de perfil
    editProfileSection.style.display = 'none'; // Ocultar el formulario de edición
});

// Enviar los datos del formulario de edición (AJAX)
editProfileForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que la página se recargue

    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;

    // Aquí puedes hacer la solicitud a PHP para actualizar los datos en la base de datos
    fetch('/monsterlabs/mvc/controllers/monitor.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            phone: phone
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Actualizar los datos en la interfaz de usuario si es exitoso
            document.getElementById('email-monitor').textContent = email;
            document.getElementById('phone-monitor').textContent = phone;

            // Ocultar el formulario de edición
            editProfileSection.style.display = 'none';
            perfilInfo.style.display = 'block'; // Mostrar la sección de perfil
            alert('Perfil actualizado con éxito');
        } else {
            alert('Error al actualizar el perfil');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al actualizar los datos');
    });
});



// ---------------------FORMULARIO DE CAMBIO DE CONTRASEÑA-----------------------
//Validacion password
function validarContrasena(password) {
    // Expresión regular para la validación de la contraseña
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,16}$/;

    // Test de la contraseña con la expresión regular
    if (regex.test(password)) {
        return true; // La contraseña es válida
    } else {
        return false; // La contraseña no es válida
    }
}

// Obtener el valor de la contraseña
const password = document.getElementById('newPassword').value;

// Validar la contraseña
if (validarContrasena(password)) {
    console.log('Contraseña válida');
    // Aquí puedes continuar con el envío del formulario o hacer lo que necesites
} else {
    console.log('La contraseña debe tener al menos una mayúscula, una minúscula, un número y entre 5 y 16 caracteres.');
    // Aquí puedes mostrar un mensaje de error o resaltar el campo
}



document.addEventListener('DOMContentLoaded', function() {
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const cancelChangePasswordBtn = document.getElementById('cancelChangePasswordBtn');
    const changePasswordSection = document.getElementById('changePasswordSection');
    const changePasswordForm = document.getElementById('changePasswordForm');

    // Cuando se hace clic en "Cambiar Contraseña"
    changePasswordBtn.addEventListener('click', function() {
        // Mostrar el formulario para cambiar contraseña
        perfilInfo.style.display = 'none'; // Ocultar la sección de perfil
        changePasswordSection.style.display = 'block';
    });

    // Cuando se hace clic en "Cancelar"
    cancelChangePasswordBtn.addEventListener('click', function() {
        // Ocultar el formulario de cambio de contraseña
        perfilInfo.style.display = 'block'; // Mostrar la sección de perfil
        changePasswordSection.style.display = 'none';
    });

    // Cuando se envía el formulario de cambio de contraseña
    changePasswordForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar la recarga de la página

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Verificar que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        // Hacer la solicitud al servidor para cambiar la contraseña
        fetch('/monsterlabs/mvc/controllers/monitor.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Contraseña cambiada con éxito');
                changePasswordSection.style.display = 'none';
            } else {
                alert('Error al cambiar la contraseña: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al cambiar la contraseña');
        });
    });
});

// --------------------------CERRAR SESION----------------------------
document.addEventListener("click", function(event) {
    // Detectar si se hizo clic en el botón de salir
    let logoutBtn = event.target.closest("#logoutBtn");
    if (logoutBtn) {
        event.preventDefault();
        
        fetch("/monsterlabs/mvc/controllers/logout.php")
            .then(() => {
                window.location.href = "/monsterlabs/index.php"; // Redirigir tras cerrar sesión
            })
            .catch(error => console.error("Error al cerrar sesión:", error));
    }
});
