/***********COMPONENTE SIDEBAR**************/
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



    //--------------- ITERAR SOBRE CADA ENLACE ---------------
    menuLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); 

            // Primero, ocultamos todas las secciones
            sections.forEach(section => {
                section.classList.remove("active");
            });

            // Ahora mostramos solo la sección correspondiente
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
    fetch('/monsterlabs/mvc/controllers/monitor/usuario.php', {
        method: 'GET',  
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json()) 
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
            alert(data.message);
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







document.addEventListener("DOMContentLoaded", function () {

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
        perfilInfo.style.display = 'flex'; 
        editProfileSection.style.display = 'none'; 
    });


    //----------------ACTUALIZAR CONTRASEÑA ---------------
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const cancelChangePasswordBtn = document.getElementById('cancelChangePasswordBtn');
    const changePasswordSection = document.getElementById('changePasswordSection');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const messageEditPassword = document.getElementById('message-edit-password');
    // Cuando se hace clic en "Cambiar Contraseña"
    changePasswordBtn.addEventListener('click', function() {
        // Mostrar el formulario para cambiar contraseña
        perfilInfo.style.display = 'none'; // Ocultar la sección de perfil
        changePasswordSection.style.display = 'block';
       
    });

    // Cuando se hace clic en "Cancelar"
    cancelChangePasswordBtn.addEventListener('click', function() {
        // Ocultar el formulario de cambio de contraseña
        perfilInfo.style.display = 'flex'; // Mostrar la sección de perfil
        changePasswordSection.style.display = 'none';
    });


    //--------------- VALIDACIONES DE CAMPOS VACIOS ---------------
    const emailInput = document.getElementById("editEmail");
    const phoneInput = document.getElementById("editPhone");
    const emailError = document.getElementById("email-error");
    const phoneError = document.getElementById("phone-error");
    const passwordInput = document.getElementById("currentPassword");
    const passwordInputNew = document.getElementById("newPassword");
    const passwordInputConfirm = document.getElementById("confirmPassword");
    const passwordErrorActual = document.getElementById("password-actual-error");
    const passwordErrorNew = document.getElementById("password-new-error");
    const passwordErrorConfirm = document.getElementById("password-confirm-error");

    function validateEmail() {
        const email = emailInput.value.trim();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (email === "") {
            emailError.textContent = "El correo electrónico es obligatorio";
            emailInput.classList.add("error");
        } else if (!emailPattern.test(email)) {
            emailError.textContent = "Ingrese un correo válido";
            emailInput.classList.add("error");
        } else {
            emailError.textContent = "";
            emailInput.classList.remove("error");
        }
    }

    function validatePhone() {
        const phone = phoneInput.value.trim();
        const phonePattern = /^[0-9]{9}$/; 

        if (phone === "") {
            phoneError.textContent = "El teléfono es obligatorio";
            phoneInput.classList.add("error");
        } else if (!phonePattern.test(phone)) {
            phoneError.textContent = "El teléfono debe tener 9 dígitos";
            phoneInput.classList.add("error");
        } else {
            phoneError.textContent = "";
            phoneInput.classList.remove("error");
        }
    }

    function validatePasswordNew() {
        const password = passwordInputNew.value.trim();
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/;

        if (password === "") {
            passwordErrorNew.textContent = "La contraseña es obligatoria";
            passwordInputNew.classList.add("error");
        } else if (!passwordPattern.test(password)) {
            passwordErrorNew.textContent = "La contraseña debe tener al menos una mayúscula, una minúscula, un número y entre 6 y 16 caracteres";
            passwordInputNew.classList.add("error");
        } else {
            passwordErrorNew.textContent = "";
            passwordInputNew.classList.remove("error");
        }
    }

    function validateConfirmPassword() {
        const password = passwordInputConfirm.value.trim();

        if (password === "") {
            passwordErrorConfirm.textContent = "La contraseña es obligatoria";
            passwordInputConfirm.classList.add("error");
        } else if (password !== passwordInputNew.value) {
            passwordErrorConfirm.textContent = "Las contraseñas no coinciden";
            passwordInputConfirm.classList.add("error");
        } else {
            passwordErrorConfirm.textContent = "";
            passwordInputConfirm.classList.remove("error");
        }
    }

    function validatePassword() {
        const password = passwordInput.value.trim();

        if (password === "") {
            passwordErrorActual.textContent = "La contraseña es obligatoria";
            passwordErrorActual.classList.add("error");
        } else {
            passwordErrorActual.textContent = "";
            passwordErrorActual.classList.remove("error");
        }

    }
    

    // Evento para validar cuando el usuario sale del campo
    emailInput.addEventListener("blur", validateEmail);
    phoneInput.addEventListener("blur", validatePhone);
    passwordInputNew.addEventListener("blur", validatePasswordNew);
    passwordInputConfirm.addEventListener("blur", validateConfirmPassword);
    passwordInput.addEventListener("blur", validatePassword);

    // Evento para limpiar el error cuando el usuario entra en el campo
    emailInput.addEventListener("focus", () => emailError.textContent = "");
    phoneInput.addEventListener("focus", () => phoneError.textContent = "");
    passwordInputNew.addEventListener("focus", () => passwordErrorNew.textContent = "");
    passwordInputConfirm.addEventListener("focus", () => passwordErrorConfirm.textContent = "");
    passwordInput.addEventListener("focus", () => passwordErrorActual.textContent = "");


    // document.getElementById("editProfileForm").addEventListener("submit", function (event) {
    //     validateEmail();
    //     validatePhone();

    //     if (emailError.textContent || phoneError.textContent) {
    //         event.preventDefault();
    //     }
    // });

    //--------------- ENVIAR LOS DATOS DEL FORMULARIO DE EDICION DE EMAIL Y TELEFONO ---------------
    editProfileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        validateEmail();
        validatePhone();

        if (emailError.textContent || phoneError.textContent) {
            event.preventDefault();
        }
        const email = document.getElementById('editEmail').value;
        const phone = document.getElementById('editPhone').value;
        const messageEditProfile = document.getElementById('message-edit-profile');
        
        fetch('/monsterlabs/mvc/controllers/monitor/editar-datos.php', {
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
                // editProfileSection.style.display = 'none';
                // perfilInfo.style.display = 'block';
                messageEditProfile.textContent = 'Datos cambiados con éxito';
            } else {
                messageEditProfile.textContent = 'Error al actualizar el perfil';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });




    // document.getElementById("changePasswordForm").addEventListener("submit", function (event) {
    //     validatePassword();
    //     validateConfirmPassword();

    //     if (passwordErrorNew.textContent || passwordErrorConfirm.textContent) {
    //         event.preventDefault();
    //     }
    // });

     // ---------------------FORMULARIO DE CAMBIO DE CONTRASEÑA-----------------------

    // Cuando se envía el formulario de cambio de contraseña
    changePasswordForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar la recarga de la página

        validatePassword();
        validateConfirmPassword();

        if (passwordErrorNew.textContent || passwordErrorConfirm.textContent) {
            event.preventDefault();
        }

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;

        // Verificar que las contraseñas coincidan
        // if (newPassword !== confirmPassword) {
        //     messageEditPassword.textContent = 'Las contraseñas no coinciden';
        //     return;
        // }

        // Hacer la solicitud al servidor para cambiar la contraseña
        fetch('/monsterlabs/mvc/controllers/monitor/editar-datos.php', {
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
                passwordErrorActual.textContent = 'Cambio de contraseña realizado con éxito';
                // changePasswordSection.style.display = 'none';
            } else {
                // alert('Error al cambiar la contraseña: ' + data.message);
                passwordErrorActual.textContent = data.message;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            passwordErrorActual.textContent = 'Hubo un problema al cambiar la contraseña';
        });
    });
});





// --------------------------ASISTENCIA----------------------------

document.addEventListener("DOMContentLoaded", function () {

    const registerAttendanceBtn = document.getElementById('register-attendance-btn');
    const selectionAttendance = document.getElementById('selection-attendance');
    const viewAttendanceBtn = document.getElementById('view-attendance-btn');
    const viewAttendance = document.getElementById('view-attendance');
    const imageAttendance = document.getElementById('image-attendance');
    const menuLinks = document.querySelectorAll(".sidebar a[data-section]");

    // Boton de registro de asistencia
    registerAttendanceBtn.addEventListener('click', function() {
        imageAttendance.style.display = 'none';
        viewAttendance.style.display = 'none'; 
        selectionAttendance.style.display = 'grid';
    });

    // Boton de ver asistencia
    viewAttendanceBtn.addEventListener('click', function() {
        imageAttendance.style.display = 'none';
        selectionAttendance.style.display = 'none';
        viewAttendance.style.display = 'grid'; 
    });


    menuLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); 

            imageAttendance.style.display = 'block';
        selectionAttendance.style.display = 'none';
        viewAttendance.style.display = 'none';
        });
    });


    const calendar = document.querySelector('#calendar'); // Referencia al componente del calendario
    const messageAsistencia = document.getElementById('message-envio-asistencia');
    // Escuchar el evento 'change' para obtener la fecha seleccionada
    calendar.addEventListener('change', function() {
        const selectedDate = calendar.value; // La fecha seleccionada está en el atributo 'value'

        if (selectedDate) {
            console.log('Fecha seleccionada: ', selectedDate);  // Mostrar la fecha seleccionada en la consola

            // Actualizar la tabla de asistencia con la fecha seleccionada
            updateAttendanceTable(selectedDate);
            viewAttendanceTable(selectedDate);
        } else {
            console.error('No se pudo obtener la fecha seleccionada.');
        }
    });

    // Función para actualizar la tabla de asistencia
    function updateAttendanceTable(date) {
    if (!date) {
        messageAsistencia.textContent = 'Fecha no válida proporcionada.';
        return;
    }

    fetch(`/monsterlabs/mvc/controllers/monitor/obtener-estudiantes.php?date=${date}`)
        .then(response => response.json())
        .then(data => {
            const groupMembers = document.getElementById('groupMembers');
            groupMembers.innerHTML = ''; // Limpiar la tabla antes de llenarla

            if (data.status === 'success') {
                data.ninos.forEach(nino => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${nino.nombre} ${nino.apellido}</td>	
                        <td>
                            <input type="radio" name="attendance_${nino.id_nino}" value="asistio" 
                                   ${nino.estado === 'asistio' ? 'checked' : ''}> Asistió
                        </td>
                        <td>
                            <input type="radio" name="attendance_${nino.id_nino}" value="ausente" 
                                   ${nino.estado === 'ausente' ? 'checked' : ''}> Ausente
                        </td>
                    `;
                    groupMembers.appendChild(row);
                });
            } else {
                groupMembers.innerHTML = '<tr><td colspan="3">No se encontraron estudiantes para esta fecha.</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error al obtener los estudiantes:', error);
        });
}

    const form = document.getElementById("attendanceForm");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const fecha = calendar.value;  // Obtener la fecha seleccionada directamente del atributo 'value'
        let asistencia = [];
        let allSelected = true;  // Bandera para verificar si todas las filas tienen una opción seleccionada

        // Itera sobre cada fila de la tabla
        document.querySelectorAll("#groupMembers tr").forEach(fila => {
            // Verifica si la fila tiene radio inputs
            const radioInputs = fila.querySelectorAll("input[type='radio']");
            if (radioInputs.length === 0) {
                
                return; 
            }
            
            // Verificar si hay un radio button seleccionado
            let seleccionado = false;
            radioInputs.forEach(radio => {
                if (radio.checked) {
                    seleccionado = true;  // Si hay un radio button seleccionado, marcarlo
                }
            });

            if (!seleccionado) {
                allSelected = false;
                fila.style.backgroundColor = "#f8d7da"; // Resalta la fila en color rojo si no está seleccionada
            } else {
                fila.style.backgroundColor = ""; // Si está seleccionado, quita el resaltado
            }
        });

        // Si alguna fila no tiene opción seleccionada, muestra un error
        if (!allSelected) {
            messageAsistencia.textContent = "Por favor, selecciona una opción (Asistió o Ausente) para cada estudiante.";
            return;  // Detiene el envío del formulario
        }

        // Si todas las filas tienen una opción seleccionada, recopila los datos
        document.querySelectorAll("#groupMembers tr").forEach(fila => {
            const radioInputs = fila.querySelectorAll("input[type='radio']");
            if (radioInputs.length === 0) return; // Salta las filas que no contienen radio buttons
            
            let id = radioInputs[0].name.split("_")[1];  // Obtiene el ID de la fila a partir del nombre del radio
            let estado = null;

            // Recorre los inputs para determinar cuál está seleccionado
            radioInputs.forEach(radio => {
                if (radio.checked) {
                    estado = radio.value;  // Si el radio está seleccionado, recoge el valor
                }
            });

            if (estado) {
                asistencia.push({ id, estado });
            }
        });

        // Enviar la información mediante fetch
        fetch("/monsterlabs/mvc/controllers/monitor/guardar-asistencia.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fecha, asistencia })
        })
        .then(response => response.json())
        .then(data => {
            messageAsistencia.textContent = data.message; // Muestra el mensaje de éxito o error
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });

    /* ***************RELLENAR TABLA DE VER ASISTENCIA************* */
    // function viewAttendanceTable(fecha) {
    //     if (!fecha) {
    //         messageAsistencia.textContent = 'Fecha no válida proporcionada.';
    //         return;
    //     }

    //     // Llamar al backend para obtener la asistencia
    // fetch(`/monsterlabs/mvc/controllers/monitor/obtener-asistencia.php?fecha=${fecha}`)
    // .then(response => response.json())
    // .then(data => {
    //     const tablaAsistencia = document.getElementById('tablaAsistencia');
    //     tablaAsistencia.innerHTML = ''; // Limpiar la tabla antes de llenarla

    //     if (data.status === 'success') {
    //         // Crear la tabla con los datos de asistencia
    //         const tabla = document.createElement('table');
    //         tabla.className = 'table';
    //         tabla.innerHTML = `
    //             <thead>
    //                 <tr>
    //                     <th>Nombre</th>
    //                     <th>Apellido</th>
    //                     <th>Estado</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 ${data.asistencia.map(nino => `
    //                     <tr>
    //                         <td>${nino.nombre}</td>
    //                         <td>${nino.apellido}</td>
    //                         <td>${nino.estado || 'No registrado'}</td>
    //                     </tr>
    //                 `).join('')}
    //             </tbody>
    //         `;
    //         tablaAsistencia.appendChild(tabla);
    //     } else {
    //         tablaAsistencia.innerHTML = '<p>No se encontraron registros de asistencia para esta fecha.</p>';
    //     }
    // })
    // .catch(error => {
    //     console.error('Error al obtener la asistencia:', error);
    // });
    // }

});

 /* ***************RELLENAR TABLA DE VER ASISTENCIA************* */
document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.querySelector('#calendar-view-attendance'); // Referencia al componente del calendario
    const messageAsistencia = document.getElementById('message-envio-asistencia');

    // Escuchar el evento 'change' para obtener la fecha seleccionada
    calendar.addEventListener('change', function () {
        const selectedDate = calendar.value; // Obtener la fecha seleccionada
        if (selectedDate) {
            viewAttendanceTable(selectedDate); // Llamar a la función para rellenar la tabla
        } else {
            console.error('No se pudo obtener la fecha seleccionada.');
        }
    });

    // Función para rellenar la tabla de asistencia
    function viewAttendanceTable(fecha) {
        if (!fecha) {
            messageAsistencia.textContent = 'Fecha no válida proporcionada.';
            return;
        }

        // Llamar al backend para obtener la asistencia
        fetch(`/monsterlabs/mvc/controllers/monitor/obtener-asistencia.php?fecha=${fecha}`)
            .then(response => response.json())
            .then(data => {
                const tablaAsistencia = document.getElementById('tablaAsistencia');
                tablaAsistencia.innerHTML = ''; // Limpiar la tabla antes de llenarla

                if (data.status === 'success') {
                    // Rellenar la tabla con los datos de asistencia
                    data.asistencia.forEach(nino => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${nino.nombre}</td>
                            <td>${nino.apellido}</td>
                            <td>${nino.estado || 'No registrado'}</td>
                        `;
                        tablaAsistencia.appendChild(row);
                    });
                } else {
                    tablaAsistencia.innerHTML = '<tr><td colspan="3">No se encontraron registros de asistencia para esta fecha.</td></tr>';
                }
            })
            .catch(error => {
                console.error('Error al obtener la asistencia:', error);
            });
    }
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
