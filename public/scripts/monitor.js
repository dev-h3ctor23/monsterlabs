/***********COMPONENTE SIDEBAR**************/

// ---------------------CODIGO PARA CUANDO SE VUELE ATRAS AL CERRAR SESION-----------------------º
// Empuja un estado al historial
window.history.pushState(null, null, window.location.href);

// Listener para el evento popstate (cuando se presiona "atrás")
window.addEventListener('popstate', function (event) {
  window.location.replace("/monsterlabs/mvc/views/log-in.html");
});

// Listener para el evento pageshow (para detectar carga desde la cache)
window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    window.location.replace("/monsterlabs/mvc/views/log-in.html");
  }
});

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


            const profileImage = document.getElementById('profileImage');
            if (data.usuario.foto) {
                profileImage.src = data.usuario.foto;
            } else {
                profileImage.src = '/monsterlabs/assets/fotoUsuarios/defecto.png';
            }

            document.getElementById('editEmail').value = data.usuario.email;
            document.getElementById('editPhone').value = data.monitor.telefono;
        } else if (data.redirect) {
            // Redirigir al usuario si la respuesta indica una redirección
            window.location.href = data.redirect;
        } else {
            alert(data.message); // Mostrar el mensaje de error del servidor
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
  
//-----------------------ACTUALIZAR FOTO ------------------------
// Manejar la selección de archivos
const fileInput = document.getElementById('fileInput');
const editPhotoButton = document.getElementById('editPhoto');
const profileImage = document.getElementById('profileImage');

// Abrir el selector de archivos al hacer clic en el botón
editPhotoButton.addEventListener('click', function () {
    fileInput.click();
});

// Manejar la selección de archivos
fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0]; // Obtener el archivo seleccionado

    if (file) {
        // Validar el tipo de archivo (solo imágenes JPEG o PNG)
        if (!file.type.startsWith('image/')) {
            alert('Solo se permiten imágenes JPEG o PNG.');
            return; // Detener la ejecución si el tipo no es válido
        }

        // Mostrar la imagen seleccionada en la página
        const reader = new FileReader();
        reader.onload = function (e) {
            profileImage.src = e.target.result; // Actualizar la imagen de perfil
        };
        reader.readAsDataURL(file); // Leer el archivo como una URL de datos

        // Subir la imagen al servidor
        const formData = new FormData();
        formData.append('foto', file); // Agregar el archivo al FormData

        fetch('/monsterlabs/mvc/controllers/monitor/cambiar-foto.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            if (data.status === "success") {
                console.log('Foto subida y guardada en la base de datos');
            } else {
                console.error('Error al subir la foto:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
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
        perfilInfo.style.display = 'grid'; 
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
    const asuntoMensaje = document.getElementById("asunto");
    const descripcionMensaje = document.getElementById("descripcion");
    const asuntoError = document.getElementById("asunto-error");
    const descripcionError = document.getElementById("descripcion-error");

    function validateContact() {
        const asunto = asuntoMensaje.value.trim();
        if (asunto === "" ) {
            asuntoError.textContent = "El asunto es obligatorio";
            asuntoError.classList.add("error");
        } else {
            asuntoError.classList.remove("error");
        }
    }

    function validateDescripcion() {
        const descripcion = descripcionMensaje.value.trim();
        if (descripcion === "" ) {
            descripcionError.textContent = "La descripción es obligatoria";
            descripcionError.classList.add("error");
        } else {
            descripcionError.classList.remove("error");
        }
    }

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
    asuntoMensaje.addEventListener("blur", validateContact);
    descripcionMensaje.addEventListener("blur", validateDescripcion);

    // Evento para limpiar el error cuando el usuario entra en el campo
    emailInput.addEventListener("focus", () => emailError.textContent = "");
    phoneInput.addEventListener("focus", () => phoneError.textContent = "");
    passwordInputNew.addEventListener("focus", () => passwordErrorNew.textContent = "");
    passwordInputConfirm.addEventListener("focus", () => passwordErrorConfirm.textContent = "");
    passwordInput.addEventListener("focus", () => passwordErrorActual.textContent = "");
    asuntoMensaje.addEventListener("focus", () => asuntoMensaje.classList.remove("error"));
    descripcionMensaje.addEventListener("focus", () => descripcionMensaje.classList.remove("error"));

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

            imageAttendance.style.display = 'flex';
        selectionAttendance.style.display = 'none';
        viewAttendance.style.display = 'none';
        });
    });


    const calendar = document.querySelector('#calendar'); // Referencia al componente del calendario
    const messageAsistencia = document.getElementById('message-envio-asistencia');

    function configurarCalendario(selectorCalendario, selectorMensaje, fechaMinima, fechaMaxima, funcionActualizacion) {
        const calendar = document.querySelector(selectorCalendario); // Referencia al componente del calendario
        const messageAsistencia = document.querySelector(selectorMensaje);
    
        // Configurar el calendario con las fechas mínima y máxima
        calendar.min = fechaMinima.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        calendar.max = fechaMaxima.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
        calendar.addEventListener('change', function () {
            const selectedDate = calendar.value; // Obtener la fecha en formato YYYY-MM-DD
            console.log('Fecha seleccionada:', selectedDate); // Verificar en la consola
    
            // Convertir la fecha seleccionada a objeto Date para validar el rango
            const selectedDateObj = new Date(selectedDate);
    
            // Validar que la fecha esté dentro del rango permitido
            if (selectedDateObj >= fechaMinima && selectedDateObj <= fechaMaxima) {
                // Verificar si la fecha seleccionada es un fin de semana
                const dayOfWeek = selectedDateObj.getDay(); // 0 (Domingo) a 6 (Sábado)
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    console.error('No se pueden seleccionar fines de semana.');
                    messageAsistencia.textContent = 'Por favor, selecciona un día entre semana (lunes a viernes).';
                    messageAsistencia.style.color = 'red';
                    calendar.value = ''; // Limpiar la selección
                    groupMembers.innerHTML = '';
                    tablaAsistencia.innerHTML = '';
                } else {
                    console.log('Fecha válida. Actualizando tabla...');
                    funcionActualizacion(selectedDate); // Llamar a la función de actualización
                    messageAsistencia.textContent = '';
                }
            } else {
                console.error('Fecha fuera del rango permitido.');
                messageAsistencia.textContent = `Por favor, selecciona una fecha entre ${fechaMinima.toLocaleDateString()} y ${fechaMaxima.toLocaleDateString()}.`;
                messageAsistencia.style.color = 'red';
                calendar.value = ''; // Limpiar la selección
            }
        });
    }

    // Definir fechas mínima y máxima
    const fechaMinima = new Date(2025, 5, 2); // 16 de junio de 2025
    const fechaMaxima = new Date(2025, 7, 16); // 16 de agosto de 2025

    // Configurar el calendario
    configurarCalendario(
        '#calendar', // Selector del calendario
        '#message-envio-asistencia', // Selector del mensaje de asistencia
        fechaMinima, // Fecha mínima
        fechaMaxima, // Fecha máxima
        updateAttendanceTable // Función de actualización
    );

    /***************FUNCION PARA ACTUALIZAR LA TABLA DE TOMA DE ASISTENCIA********************* */
    function updateAttendanceTable(date) {
        if (!date) {
            messageAsistencia.textContent = 'Fecha no válida proporcionada.';
            return;
        }
    
        console.log('Actualizando tabla para la fecha:', date); // Verificar en la consola
    
        fetch(`/monsterlabs/mvc/controllers/monitor/obtener-estudiantes.php?date=${date}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la API');
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos recibidos:', data); // Verificar en la consola
                const groupMembers = document.getElementById('groupMembers');
                groupMembers.innerHTML = ''; // Limpiar la tabla antes de llenarla
    
                if (data.status === 'success') {
                    console.log('Número de niños recibidos:', data.ninos.length); // Verificar en la consola
                    data.ninos.forEach(nino => {
                        console.log('Procesando niño:', nino); // Verificar en la consola
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${nino.nombre} ${nino.apellido}</td>	
                            <td>
                                <input type="radio" class="radio-attendance present" name="attendance_${nino.id_nino}" value="asistio" 
                                    ${nino.estado === 'asistio' ? 'checked' : ''}> Asistió
                            </td>
                            <td>
                                <input type="radio" class="radio-attendance absent" name="attendance_${nino.id_nino}" value="ausente" 
                                    ${nino.estado === 'ausente' ? 'checked' : ''}> Ausente
                            </td>
                        `;
                        groupMembers.appendChild(row);
                    });
                } else {
                    console.error('No se encontraron estudiantes para esta fecha.');
                    groupMembers.innerHTML = '<tr><td colspan="3">No se encontraron estudiantes para esta fecha.</td></tr>';
                }
            })
            .catch(error => {
                console.error('Error al obtener los estudiantes:', error);
                messageAsistencia.textContent = 'Error al cargar la lista de estudiantes.';
            });
    }


    //*********FORMULARIO DE ENVIO DE ASISTENCIA***********
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
            messageAsistencia.style.color = 'red';
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

    /************************************* */

    /****************VER ASISTENCIA************** */ 
    const tablaAsistencia = document.getElementById('tablaAsistencia');

    // // Escuchar el evento 'change' para obtener la fecha seleccionada
    // calendarViewAttendance.addEventListener('change', function () {
    //     const selectedDate = calendarViewAttendance.value; // Obtener la fecha seleccionada
    //     if (selectedDate) {
    //         console.log('Fecha seleccionada: ', selectedDate); 
    //         viewAttendanceTable(selectedDate); // Llamar a la función para rellenar la tabla
    //     } else {
    //         console.error('No se pudo obtener la fecha seleccionada.');
    //         messageAsistencia.textContent = 'Fecha no válida proporcionada.';
    //     }
    // });

    // Configurar el calendario
    configurarCalendario(
        '#calendar-view-attendance', // Selector del calendario
        '#message-view-attendance', // Selector del mensaje de asistencia
        fechaMinima, // Fecha mínima
        fechaMaxima, // Fecha máxima
        viewAttendanceTable // Función de actualización
    );

    // Función para rellenar la tabla de asistencia
    function viewAttendanceTable(fecha) {
        if (!fecha) {
            messageAsistencia.textContent = 'Fecha no válida proporcionada.';
            return;
        }

        // Limpiar la tabla antes de llenarla
        tablaAsistencia.innerHTML = '<tr><td colspan="3">Cargando asistencia...</td></tr>';

        // Llamar al backend para obtener la asistencia
        fetch(`/monsterlabs/mvc/controllers/monitor/obtener-asistencia.php?fecha=${fecha}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success' && data.asistencia.length > 0) {
                    // Limpiar la tabla antes de llenarla
                    tablaAsistencia.innerHTML = '';

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
                tablaAsistencia.innerHTML = '<tr><td colspan="3">Error al cargar la asistencia. Inténtelo de nuevo más tarde.</td></tr>';
                messageAsistencia.textContent = 'Error al cargar la asistencia.';
            });
    }

    


    /*******RELLENAR TABLA CON LA INFORMACION DE CADA NIÑO DEL GRUPO*/
        // Obtener el modal y el botón de cierre
        const modal = document.getElementById("infoModal");
        const closeModalBtn = document.getElementById("closeModal");
    
        // Cerrar el modal cuando se hace clic en la "X"
        closeModalBtn.addEventListener("click", function () {
            modal.classList.remove("show");
        });
    
        // Cerrar el modal cuando se hace clic fuera del contenido
        window.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.classList.remove("show");
            }
        });
    
        // Obtener datos de los niños desde el backend
        fetch(`/monsterlabs/mvc/controllers/monitor/info-grupos.php`)
            .then(response => response.json())
            .then(data => {
                console.log("Respuesta del servidor:", data); // Depuración
                const viewGroupMembers = document.getElementById('viewGroupMembers');
                viewGroupMembers.innerHTML = ''; // Limpiar la tabla antes de llenarla
    
                if (data.status === 'success') {
                    data.ninos.forEach(nino => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${nino.nino.nombre_nino}</td>
                            <td>${nino.nino.apellido_nino}</td>
                            <td>${nino.padre.nombre_padre} ${nino.padre.apellido_padre}</td>
                            <td>${nino.padre.dni_padre}</td>
                            <td>${nino.padre.telefono}</td>
                            <td>${nino.observaciones.observacion}</td>

                            <td><img src="/monsterlabs/assets/icons/edit.svg" alt="icono-editar" id='editarObservaciones' data-nino='${JSON.stringify(nino)}'></td>
                            <td><img src="/monsterlabs/assets/icons/info.svg" alt="icono-informacion" id= 'infoNino' data-nino='${JSON.stringify(nino)}'></td>
                        `;
                        viewGroupMembers.appendChild(row);
                        console.log(nino.observaciones.observacion);
                    });
                    
                      //Agregar manejador de eventos a cada ícono de editar observaciones
                    document.querySelectorAll('#editarObservaciones').forEach(icon => {
                        icon.addEventListener('click', function () {
                            const nino = JSON.parse(this.getAttribute('data-nino'));
                            const row = this.closest('tr'); // Obtener la fila actual

                            // Mostrar formulario para editar en el modal
                            document.getElementById("modalContent").innerHTML = `
                            <form id="editObservacionesForm">
                                <div class="form-group">
                                    <label for="observaciones">Observaciones:</label>
                                    <textarea id="observaciones" name="observaciones" class="form-control" rows="4">${nino.observaciones.observacion}</textarea>
                                </div>
                                <div class="button-edit">
                                    <button type="submit" class="btn">Guardar</button>
                                    <button type="button" class="btn" id="cancelEditObservaciones">Volver</button>
                                </div>
                            </form>
                        `;

                        // Mostrar el modal
                        modal.classList.add("show");

                        // Evento para guardar los cambios en la observaciones
                        document.getElementById("editObservacionesForm").addEventListener("submit", function (event) {
                            event.preventDefault();
                            const observaciones = document.getElementById("observaciones").value;
                            // Actualizar la observaciones en la base de datos
                            fetch('/monsterlabs/mvc/controllers/monitor/editar-observaciones.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    observaciones: observaciones,
                                    id_nino: nino.nino.id_nino
                                })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.status === 'success') {
                                        // Actualizarel objeto de observaciones
                                        nino.observaciones.observacion = observaciones;

                                        //Actualizar el atributo `data-nino` del ícono de editar
                                        const icon = row.querySelector('#editarObservaciones');
                                        icon.setAttribute('data-nino', JSON.stringify(nino));
                                        
                                        // Actualizar la tabla con las nuevas observaciones
                                        const observacionesCell = row.querySelector('td:nth-child(6)');
                                        observacionesCell.innerHTML = observaciones;
                                    } else {
                                        console.error('Error al actualizar las observaciones:', data.message);
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                });
                                modal.classList.remove("show");
                        });
                    });
                });

                    // Agregar manejador de eventos a cada ícono de ver informaciópn
                    document.querySelectorAll('#infoNino').forEach(icon => {
                        icon.addEventListener('click', function () {
                            const nino = JSON.parse(this.getAttribute('data-nino'));
    
                            // Mostrar la información adicional en el modal
                            document.getElementById("modalContent").innerHTML = `
                            <p><strong>Nombre del Niño:</strong> ${nino.nino.nombre_nino} ${nino.nino.apellido_nino}</p>
                            <p><strong>Fecha de Nacimiento:</strong> ${nino.nino.fecha_nacimiento}</p>
                            <p><strong>Periodo:</strong> ${nino.nino.periodo}</p>
                            ${nino.guardian.dni_guardian === "No disponible" ?
                                `<p>El niño no tiene agregado ninguna persona de confianza.</p>` :
                                `<p><strong>Nombre de la persona de Confianza:</strong> ${nino.guardian.nombre_guardian} ${nino.guardian.apellido_guardian}</p>
                                <p><strong>DNI de la persona de Confianza:</strong> ${nino.guardian.dni_guardian}</p>
                                <p><strong>Teléfono de la persona de Confianza:</strong> ${nino.guardian.telefono_guardian}</p>`
                            }
                            <p><strong>Alergias a Alimentos:</strong> ${nino.ficha_medica.alimentos_alergico}</p>
                            <p><strong>Alergias a Medicamentos:</strong> ${nino.ficha_medica.medicamentos_alergico}</p>
                            <p><strong>Medicamentos Actuales:</strong> ${nino.ficha_medica.medicamentos_actuales}</p>
                        `;
                            // Mostrar el modal
                            modal.classList.add("show");
                        });
                    });
                } else {
                    viewGroupMembers.innerHTML = '<tr><td colspan="8">No se encontraron participantes</td></tr>';
                }
            })
            .catch(error => {
                console.error('Error al obtener los estudiantes:', error);
        });


    /************CRONOGRAMA**************/
        const calendarBody = document.getElementById('calendarBody');
        const calendarHeader = document.getElementById('calendarHeader');
        const weekRange = document.getElementById('weekRange');
        const prevWeekButton = document.getElementById('prevWeek');
        const nextWeekButton = document.getElementById('nextWeek');
    
        // Inicializar la fecha actual al 2 de junio de 2024
        let currentDate = new Date(2024, 5, 2); // Los meses en JavaScript van de 0 (enero) a 11 (diciembre)
    
        function renderCalendar() {
            calendarBody.innerHTML = '';
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Lunes de la semana actual
    
            // Mostrar el rango de la semana
            weekRange.textContent = `Semana del ${formatDate(startOfWeek)} al ${formatDate(new Date(startOfWeek.getTime() + 4 * 24 * 60 * 60 * 1000))}`;
    
            // Obtener los datos del cronograma
            fetch('/monsterlabs/mvc/controllers/monitor/obtener-cronograma.php')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        renderActivities(data.data, startOfWeek);
                    } else {
                        console.error('Error al obtener los datos:', data.message);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    
        function renderActivities(actividades, startOfWeek) {
            // Crear la fila de encabezados (días de la semana)
            const headerRow = document.createElement('tr');
            ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].forEach(day => {
                const th = document.createElement('th');
                th.textContent = day;
                headerRow.appendChild(th);
            });
            calendarHeader.innerHTML = ''; // Limpiar encabezados anteriores
            calendarHeader.appendChild(headerRow);
    
            // Crear una fila para las actividades
            const row = document.createElement('tr');
    
            // Generar celdas para cada día de la semana
            for (let day = 0; day < 5; day++) {
                const cell = document.createElement('td');
                const currentDay = new Date(startOfWeek);
                currentDay.setDate(startOfWeek.getDate() + day);
    
                // Filtrar actividades para el día actual
                const actividadesDia = actividades.filter(actividad => {
                    const actividadFecha = new Date(actividad.fecha);
                    return actividadFecha.toDateString() === currentDay.toDateString();
                });
                

                
                // Mostrar actividades como tarjetas
                const modal = document.getElementById("infoModalCronogram");
                const closeModalBtn = document.getElementById("closeModalCronogram");
            
                // Cerrar el modal cuando se hace clic en la "X"
                closeModalBtn.addEventListener("click", function () {
                    modal.classList.remove("show");
                });
            
                // Cerrar el modal cuando se hace clic fuera del contenido
                window.addEventListener("click", function (event) {
                    if (event.target === modal) {
                        modal.classList.remove("show");
                    }
                });

                actividadesDia.forEach(actividad => {
                    const tarjeta = document.createElement('div');
                    tarjeta.className = 'tarjeta-actividad';
                    tarjeta.innerHTML = `
                        <strong>${actividad.nombre_actividad}</strong>
                        <p>${actividad.hora_inicio} - ${actividad.hora_fin}</p>
                    `;
                    tarjeta.addEventListener('click', function () {
                        document.getElementById("modalContentCronogram").innerHTML = `
                        <div class="modal-contenido">
                            <h2>${actividad.nombre_actividad}</h2>
                            <p><strong>Horario:</strong> ${actividad.hora_inicio} - ${actividad.hora_fin}</p>
                            <p><strong>Descripción:</strong> ${actividad.descripcion}</p>
                        </div>
                        `;
            
                        modal.classList.add("show");
                        
                    });     
                    cell.appendChild(tarjeta);
                });

                row.appendChild(cell);
            }
    
            calendarBody.appendChild(row);
        }

        function formatDate(date) {
            return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
    
        prevWeekButton.addEventListener('click', function () {
            currentDate.setDate(currentDate.getDate() - 7);
            renderCalendar();
        });
    
        nextWeekButton.addEventListener('click', function () {
            currentDate.setDate(currentDate.getDate() + 7);
            renderCalendar();
        });
    
        renderCalendar();


    //----------------------------CONTACTO - MENSAJES --------------------------
    const formContact = document.getElementById('form-notificaciones');

    formContact.addEventListener("submit", function (event) {
        event.preventDefault();
        const asunto = document.getElementById('asunto').value;
        const descripcion = document.getElementById('descripcion').value;
        const messageContact = document.getElementById('message-contact');

        fetch("/monsterlabs/mvc/controllers/monitor/envio-mensaje.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                asunto: asunto,
                descripcion: descripcion
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    messageContact.textContent = data.message;
                    messageContact.style.color = "green";
                } else {
                    messageContact.textContent = data.message;
                    messageContact.style.color = "red";
                }
            })
            .catch(error => {
                console.error("Error:", error);
                messageContact.textContent = "Error de conexión";
                messageContact.style.color = "red";
            });

    });

    // --------------------------CERRAR SESION----------------------------
    document.addEventListener("click", function (event) {
        // Detectar si se hizo clic en el botón de salir
        let logoutBtn = event.target.closest("#logoutBtn");
        if (logoutBtn) {
            event.preventDefault();

            fetch("/monsterlabs/mvc/controllers/logout.php")
                .then(response => response.json()) // Parsear la respuesta como JSON
                .then(data => {
                    if (data.redirect) {
                        // Redirigir al usuario si la respuesta indica una redirección
                        window.location.href = data.redirect;
                    }
                })
                .catch(error => console.error("Error al cerrar sesión:", error));
        }
    });
    
});

document.addEventListener("DOMContentLoaded", function () {
    // Obtener todos los radio buttons y checkboxes
    const radios = document.querySelectorAll('.table-attendance input[type="radio"]');
    const checkboxes = document.querySelectorAll('.table-attendance input[type="checkbox"]');

    // Convertir los radio buttons en cuadrados (opcional si ya tienes CSS)
    radios.forEach(radio => {
        radio.style.appearance = "none";
        radio.style.width = "20px";
        radio.style.height = "20px";
        radio.style.border = "2px solid #333";
        radio.style.borderRadius = "4px"; // Mantener cuadrado con esquinas sutilmente redondeadas
        radio.style.backgroundColor = "#fff";
        radio.style.cursor = "pointer";

        // Cambiar color cuando se selecciona
        radio.addEventListener("change", function () {
            radios.forEach(r => r.style.backgroundColor = "#fff"); // Reiniciar otros
            if (radio.checked) {
                radio.style.backgroundColor = "#007bff";
            }
        });
    });

    // Agregar animación a los checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.style.appearance = "none";
        checkbox.style.width = "20px";
        checkbox.style.height = "20px";
        checkbox.style.border = "2px solid #333";
        checkbox.style.borderRadius = "4px";
        checkbox.style.backgroundColor = "#fff";
        checkbox.style.cursor = "pointer";
        checkbox.style.transition = "all 0.3s ease-in-out";

        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                checkbox.style.backgroundColor = "#28a745";
                checkbox.style.borderColor = "#28a745";
                checkbox.style.transform = "scale(1.2)";
            } else {
                checkbox.style.backgroundColor = "#fff";
                checkbox.style.borderColor = "#333";
                checkbox.style.transform = "scale(1)";
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const radios = document.querySelectorAll(".radio-attendance");

    radios.forEach(radio => {
        radio.addEventListener("change", function () {
            if (this.classList.contains("present")) {
                this.style.backgroundColor = "#4CAF50"; // Verde
                this.style.boxShadow = "0 0 10px #4CAF50";
            } else if (this.classList.contains("absent")) {
                this.style.backgroundColor = "#E74C3C"; // Rojo
                this.style.boxShadow = "0 0 10px #E74C3C";
            }
            
            // Efecto de pulsación manual
            this.classList.add("animate");
            setTimeout(() => this.classList.remove("animate"), 300);
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const radios = document.querySelectorAll(".radio-attendance");

    radios.forEach(radio => {
        radio.addEventListener("change", function () {
            let row = this.closest("tr"); // Encuentra la fila actual

            // Remueve la clase de las otras filas
            row.parentElement.querySelectorAll("tr").forEach(r => r.classList.remove("selected-row"));

            // Agrega la clase a la fila seleccionada
            row.classList.add("selected-row");
        });
    });
});


