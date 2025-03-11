// Función para obtener los datos del administrador
function obtenerDatosAdministrator() {
    fetch('../../mvc/controllers/administrator/usuario.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Verificar si hay datos en la respuesta
        if (data.status === "success") {
            // Mostrar los datos del usuario en la sección de perfil
            document.getElementById('username').textContent = data.usuario.username;
            document.getElementById('full-name').textContent = `${data.admin.nombre} ${data.admin.apellido}`;
            document.getElementById('dni').textContent = data.admin.dni;
            document.getElementById('email').textContent = data.usuario.email;
            document.getElementById('phone').textContent = data.admin.telefono;

            const profileImage = document.getElementById('profileImage');
            if (data.usuario.foto) {
                profileImage.src = data.usuario.foto;
            } else {
                profileImage.src = '../../assets/fotoUsuarios/defecto.png';
            }
        } else {
            console.error('Error:', data.message);
        }
    })
    .catch(error => {
        console.log(error);
        // Mensaje de error
        alert('Error al obtener los datos del usuario');
    });
}

// Función para actualizar la foto de perfil del administrador
function actualizarFotoPerfil() {
    const fileInput = document.getElementById('input-subir-foto');
    const editPhotoButton = document.querySelector('.edit-photo-btn');
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

            fetch('../../mvc/controllers/administrator/cambiar-foto.php', {
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
                alert('Error al subir la foto');  
            });
        }
    });
}

// Función para traer las notificaciones de la base de datos
function obtenerNotificaciones() {
    fetch('../../mvc/controllers/administrator/notificaciones.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Datos recibidos:', data); // Agregar log para verificar los datos recibidos
        if (data.status === "success") {
            // Mostrar las notificaciones en la sección de notificaciones
            const notificaciones = document.querySelector('.grid-item.notifications');
            notificaciones.innerHTML = ''; // Limpiar las notificaciones anteriores

            if (data.notificaciones.length === 0) {
                notificaciones.innerHTML = '<p class="text-center">No hay notificaciones</p>';
            } else {
                data.notificaciones.forEach(notificacion => {
                    const notificacionElement = document.createElement('div');
                    notificacionElement.classList.add('notificacion');
                    notificacionElement.innerHTML = `
                        <p class="notificacion-asunto">${notificacion.asunto}</p>
                        <p class="notificacion-descripcion">${notificacion.descripcion}</p>
                        <p class="notificacion-fecha">${notificacion.fecha}</p>
                        <button class="btn-borrar-notificacion" data-id="${notificacion.id_notificacion}">Borrar</button>
                    `;
                    notificaciones.appendChild(notificacionElement);
                });

                // Añadir evento de clic a los botones de borrar
                document.querySelectorAll('.btn-borrar-notificacion').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        abrirModalBorrar(id);
                    });
                });
            }
        } else if (data.redirect) {
            // Redirigir al usuario si la respuesta indica una redirección
            window.location.href = data.redirect;
        } else {
            alert(data.message); // Mostrar el mensaje de error del servidor
        }
    })
    .catch(error => {
        console.log(error);
        alert('Error al obtener las notificaciones');
    });
}

// Función para abrir el modal de borrar
function abrirModalBorrar(id) {
    const modalOverlayDelete = document.querySelector('.modal-overlay-delete');
    const btnDeleteAll = document.querySelector('.btn-delete-all');

    modalOverlayDelete.classList.add('active');

    btnDeleteAll.onclick = function() {
        borrarNotificacion(id);
        modalOverlayDelete.classList.remove('active');
    };

    document.querySelector('.btn-close-delete').onclick = function() {
        modalOverlayDelete.classList.remove('active');
    };
}

// Función para borrar una notificación
function borrarNotificacion(id) {
    const notificacionElement = document.querySelector(`.btn-borrar-notificacion[data-id="${id}"]`).parentElement;
    notificacionElement.classList.add('notificacion-desaparecer');

    setTimeout(() => {
        fetch(`../../mvc/controllers/administrator/borrar-notificacion.php?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                notificacionElement.remove(); // Eliminar el elemento del DOM
                obtenerNotificaciones(); // Recargar las notificaciones
            } else {
                alert(data.message); // Mostrar el mensaje de error del servidor
            }
        })
        .catch(error => {
            console.log(error);
            alert('Error al borrar la notificación');
        });
    }, 300); // Esperar a que la animación termine antes de eliminar el elemento
}

// Función para mostrar el pop-up de éxito
function mostrarPopupExito(mensaje) {
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.textContent = mensaje;
    document.body.appendChild(popup);

    // Mostrar el pop-up
    setTimeout(() => {
        popup.classList.add('show');
    }, 100);

    // Desvanecer y eliminar el pop-up después de 1.5 segundos
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.remove();
        }, 500);
    }, 1500);
}

// Función para mostrar el pop-up de confirmación
function mostrarPopupConfirmacion(mensaje) {
    const popup = document.getElementById('popup-confirmation');
    const popupMessage = document.getElementById('popup-message');

    popupMessage.textContent = mensaje;
    popup.style.display = 'block'; // Asegurarse de que el pop-up esté visible
    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
        popup.classList.add('hide');
    }, 1500); // Ocultar el pop-up después de 1.5 segundos

    setTimeout(() => {
        popup.style.display = 'none'; // Ocultar completamente el pop-up
        popup.classList.remove('hide');
    }, 2000); // Esperar a que la animación termine antes de ocultar completamente
}

// Función para abrir el modal de editar perfil
function abrirModalEditarPerfil() {
    const modalOverlayProfile = document.querySelector('.modal-overlay-profile');
    const btnCloseProfile = document.querySelector('.btn-close-profile');

    // Obtener los datos del usuario actual
    const nombre = document.getElementById('full-name').textContent.split(' ')[0];
    const apellido = document.getElementById('full-name').textContent.split(' ')[1];
    const dni = document.getElementById('dni').textContent;
    const telefono = document.getElementById('phone').textContent;
    const correo = document.getElementById('email').textContent;

    // Llenar los campos del formulario con los datos del usuario
    document.getElementById('edit-nombre-profile').value = nombre;
    document.getElementById('edit-apellido-profile').value = apellido;
    document.getElementById('edit-dni-profile').value = dni;
    document.getElementById('edit-telefono-profile').value = telefono;
    document.getElementById('edit-correo-profile').value = correo;

    // Mostrar el modal
    modalOverlayProfile.classList.add('active');

    // Cerrar el modal al hacer clic en el botón "Cancelar"
    btnCloseProfile.addEventListener('click', function() {
        modalOverlayProfile.classList.remove('active');
    });
}

// Función para mostrar mensajes de error
function mostrarError(input, mensaje) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = mensaje;
    errorElement.classList.add('error-visible');
}

// Función para ocultar mensajes de error
function ocultarError(input) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = '';
    errorElement.classList.remove('error-visible');
}

// Función para validar el campo de nombre
function validarNombre() {
    const nombreInput = document.getElementById('edit-nombre-profile');
    const nombre = nombreInput.value.trim();

    if (nombre === '') {
        mostrarError(nombreInput, 'El nombre es obligatorio.');
        return false;
    } else if (nombre.length < 2) {
        mostrarError(nombreInput, 'El nombre debe tener al menos 2 caracteres.');
        return false;
    } else if (!/^[a-zA-Z\s]+$/.test(nombre)) {
        mostrarError(nombreInput, 'El nombre solo puede contener letras y espacios.');
        return false;
    } else if (/[^a-zA-Z\s]/.test(nombre)) {
        mostrarError(nombreInput, 'El nombre no puede contener caracteres especiales.');
        return false;
    } else if (nombre.length > 50) {
        mostrarError(nombreInput, 'El nombre no puede tener más de 50 caracteres.');
        return false;
    } else {
        ocultarError(nombreInput);
        return true;
    }
}

// Función para validar el campo de apellido
function validarApellido() {
    const apellidoInput = document.getElementById('edit-apellido-profile');
    const apellido = apellidoInput.value.trim();

    if (apellido === '') {
        mostrarError(apellidoInput, 'El apellido es obligatorio.');
        return false;
    } else if (apellido.length < 2) {
        mostrarError(apellidoInput, 'El apellido debe tener al menos 2 caracteres.');
        return false;
    } else if (!/^[a-zA-Z\s]+$/.test(apellido)) {
        mostrarError(apellidoInput, 'El apellido solo puede contener letras y espacios.');
        return false;
    } else if (/[^a-zA-Z\s]/.test(apellido)) {
        mostrarError(apellidoInput, 'El apellido no puede contener caracteres especiales.');
        return false;
    } else if (apellido.length > 50) {
        mostrarError(apellidoInput, 'El apellido no puede tener más de 50 caracteres.');
        return false;
    } else {
        ocultarError(apellidoInput);
        return true;
    }
}

// Función para validar el campo de DNI
function validarDNI() {
    const dniInput = document.getElementById('edit-dni-profile');
    const dni = dniInput.value.trim();

    if (dni === '') {
        mostrarError(dniInput, 'El DNI es obligatorio.');
        return false;
    } else if (!/^\d{8}[A-Z]$/.test(dni)) {
        mostrarError(dniInput, 'El DNI debe tener 8 dígitos y una letra mayúscula al final.');
        return false;
    } else if (/[^a-zA-Z0-9]/.test(dni)) {
        mostrarError(dniInput, 'El DNI no puede contener caracteres especiales.');
        return false;
    } else if (/\s/.test(dni)) {
        mostrarError(dniInput, 'El DNI no puede contener espacios en blanco.');
        return false;
    } else {
        ocultarError(dniInput);
        return true;
    }
}

// Función para validar el campo de teléfono
function validarTelefono() {
    const telefonoInput = document.getElementById('edit-telefono-profile');
    const telefono = telefonoInput.value.trim();

    if (telefono === '') {
        mostrarError(telefonoInput, 'El teléfono es obligatorio.');
        return false;
    } else if (!/^\d{9}$/.test(telefono)) {
        mostrarError(telefonoInput, 'El teléfono debe tener 9 dígitos.');
        return false;
    } else if (/[^0-9]/.test(telefono)) {
        mostrarError(telefonoInput, 'El teléfono solo puede contener números.');
        return false;
    } else if (/\s/.test(telefono)) {
        mostrarError(telefonoInput, 'El teléfono no puede contener espacios en blanco.');
        return false;
    } else {
        ocultarError(telefonoInput);
        return true;
    }
}

// Función para validar el campo de correo electrónico
function validarCorreo() {
    const correoInput = document.getElementById('edit-correo-profile');
    const correo = correoInput.value.trim();

    if (correo === '') {
        mostrarError(correoInput, 'El correo electrónico es obligatorio.');
        return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        mostrarError(correoInput, 'El correo electrónico no es válido.');
        return false;
    } else {
        ocultarError(correoInput);
        return true;
    }
}

// Función común para abrir el modal de información
function abrirModalInfo(idNino) {
    const modalOverlayInfo = document.querySelector('.modal-overlay-info');
    const infoContent = document.getElementById('info-content');

    // Limpiar el contenido antes de llenarlo
    infoContent.innerHTML = '';

    // Obtener los datos del niño
    fetch(`../../mvc/controllers/administrator/obtener_info_nino.php?id=${idNino}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            const nino = data.nino;
            const padre = data.padre;
            const grupo = data.grupo;

            // Aquí se puede verificar si los datos son undefined y asignar un valor por defecto

            if( typeof data.fichaMedica !== 'undefined') { // Si no hay datos de ficha médica
                data.fichaMedica = {
                    alimentos_alergico: 'No tiene alergias',
                    medicamentos_alergico: 'No tiene alergias',
                    medicamentos_actuales: 'No toma medicamentos'
                };
            }

            // Si no hay datos de guardian asignar un valor por defecto

            if( typeof data.guardian !== 'undefined') { // Si no hay datos de guardian
                data.guardian = {
                    nombre: 'No hay guardian',
                    apellido: '',
                    relacion: ''
                };
            }

            const fichaMedica = data.fichaMedica;
            const guardian = data.guardian;

            console.log( fichaMedica ); // Log para verificar los datos de ficha médica

            infoContent.innerHTML = `
                <p><strong>Nombre:</strong> ${nino.nombre} ${nino.apellido}</p>
                <p><strong>Fecha de Nacimiento:</strong> ${nino.fecha_nacimiento}</p>
                <p><strong>Periodo:</strong> ${nino.periodo}</p>
                <p><strong>Estado:</strong> ${nino.estado}</p>
                <p><strong>Grupo:</strong> ${grupo ? grupo.nombre_grupo : 'Sin grupo'}</p>
                <p><strong>Nombre del Padre:</strong> ${padre.nombre} ${padre.apellido}</p>
                <p><strong>Teléfono del Padre:</strong> ${padre.numero_telefono}</p>
                <p><strong>Alimentos Alérgicos:</strong> ${fichaMedica.alimentos_alergico}</p>
                <p><strong>Medicamentos Alérgicos:</strong> ${fichaMedica.medicamentos_alergico}</p>
                <p><strong>Medicamentos Actuales:</strong> ${fichaMedica.medicamentos_actuales}</p>
                <p><strong>Guardian:</strong> ${guardian.nombre} ${guardian.apellido}</p>
                <p><strong>Relación:</strong> ${guardian.relacion}</p>
            `;
        } else {
            alert(data.message); // Mostrar el mensaje de error del servidor
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Error al obtener la información del niño');
    });

    modalOverlayInfo.classList.add('active');

    document.querySelector('.btn-close-info').onclick = function() {
        modalOverlayInfo.classList.remove('active');
    };
}

// Función específica para abrir el modal de información de niños activos
function abrirModalInfoActivos(idNino) {
    abrirModalInfo(idNino);
}

// Función específica para abrir el modal de información de niños inactivos
function abrirModalInfoInactivos(idNino) {
    abrirModalInfo(idNino);
}

// Función para obtener los niños activos y llenar la tabla
function obtenerNinosActivos() {
    fetch('../../mvc/controllers/administrator/obtener_ninos_activos.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor (activos):', data); // Log para verificar la respuesta
        if (data.status === "success") {
            const tbody = document.querySelector('.full-height-table-activos tbody');
            if (!tbody) {
                console.error('No se encontró el elemento tbody para la tabla de niños activos');
                return;
            }
            tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

            data.ninos.forEach(nino => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="nombre-apellido">${nino.nombre} ${nino.apellido}</div>
                        <div class="botones">
                            <button class="boton-editar" data-id="${nino.id_nino}">Editar Grupo</button>
                            <button class="boton-info" data-id="${nino.id_nino}">Información</button>
                            <button class="boton-baja" data-id="${nino.id_nino}">Dar de Baja</button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Añadir evento de clic a los botones "Editar Grupo"
            document.querySelectorAll('.boton-editar').forEach(button => {
                button.addEventListener('click', function() {
                    const idNino = this.getAttribute('data-id');
                    abrirModalEditarGrupo(idNino);
                });
            });

            // Añadir evento de clic a los botones "Información"
            document.querySelectorAll('.boton-info').forEach(button => {
                button.addEventListener('click', function() {
                    const idNino = this.getAttribute('data-id');
                    abrirModalInfoActivos(idNino);
                });
            });

            // Añadir evento de clic a los botones "Dar de Baja"
            document.querySelectorAll('.boton-baja').forEach(button => {
                button.addEventListener('click', function() {
                    const idNino = this.getAttribute('data-id');
                    abrirModalBaja(idNino);
                });
            });
        } else {
            console.error('Error:', data.message);
        }
    })
    .catch(error => {
        console.log('Error en la solicitud:', error);
        alert('Error al obtener los niños activos');
    });
}

// Función para obtener los niños inactivos y llenar la tabla
function obtenerNinosInactivos() {
    fetch('../../mvc/controllers/administrator/obtener_ninos_inactivos.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor (inactivos):', data); // Log para verificar la respuesta
        if (data.status === "success") {
            const tbody = document.querySelector('.full-height-table-inactivos tbody');
            if (!tbody) {
                console.error('No se encontró el elemento tbody para la tabla de niños inactivos');
                return;
            }
            tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

            data.ninos.forEach(nino => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="nombre-apellido">${nino.nombre} ${nino.apellido}</div>
                        <div class="botones">
                            <button class="boton-alta" data-id="${nino.id_nino}">Dar de Alta</button>
                            <button class="boton-info" data-id="${nino.id_nino}">Información</button>
                            <button class="boton-eliminar" data-id="${nino.id_nino}">Eliminar</button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Añadir evento de clic a los botones "Dar de Alta"
            document.querySelectorAll('.boton-alta').forEach(button => {
                button.addEventListener('click', function() {
                    const idNino = this.getAttribute('data-id');
                    abrirModalAlta(idNino);
                });
            });

            // Añadir evento de clic a los botones "Información"
            document.querySelectorAll('.boton-info').forEach(button => {
                button.addEventListener('click', function() {
                    const idNino = this.getAttribute('data-id');
                    abrirModalInfoInactivos(idNino);
                });
            });

            // Añadir evento de clic a los botones "Eliminar"
            document.querySelectorAll('.boton-eliminar').forEach(button => {
                button.addEventListener('click', function() {
                    const idNino = this.getAttribute('data-id');
                    abrirModalEliminar(idNino);
                });
            });
        } else {
            console.error('Error:', data.message);
        }
    })
    .catch(error => {
        console.log('Error en la solicitud:', error);
        alert('Error al obtener los niños inactivos');
    });
}

// Función para abrir el modal de dar de baja
function abrirModalBaja(idNino) {
    const modalOverlayBaja = document.querySelector('.modal-overlay-baja');
    const btnConfirmarBaja = document.querySelector('.btn-confirmar-baja');

    modalOverlayBaja.style.display = 'flex'; // Mostrar el modal

    btnConfirmarBaja.onclick = function() {
        darDeBajaNino(idNino);
        modalOverlayBaja.style.display = 'none'; // Ocultar el modal
    };

    document.querySelector('.btn-close-baja').onclick = function() {
        modalOverlayBaja.style.display = 'none'; // Ocultar el modal
    };
}

// Función para dar de baja a un niño
function darDeBajaNino(idNino) {
    fetch(`../../mvc/controllers/administrator/dar_de_baja_nino.php?id=${idNino}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            obtenerNinosActivos(); // Actualizar la tabla de niños activos
            obtenerNinosInactivos(); // Actualizar la tabla de niños inactivos
        } else {
            alert(data.message); // Mostrar el mensaje de error del servidor
        }
    })
    .catch(error => {
        console.log('Error en la solicitud:', error);
        alert('Error al dar de baja al niño');
    });
}

// Función para abrir el modal de dar de alta
function abrirModalAlta(idNino) {
    const modalOverlayAlta = document.querySelector('.modal-overlay-alta');
    const btnConfirmarAlta = document.querySelector('.btn-confirmar-alta');

    modalOverlayAlta.classList.add('active');

    btnConfirmarAlta.onclick = function() {
        darDeAltaNino(idNino);
        modalOverlayAlta.classList.remove('active');
    };

    document.querySelector('.btn-close-alta').onclick = function() {
        modalOverlayAlta.classList.remove('active');
    };
}

// Función para dar de alta a un niño
function darDeAltaNino(idNino) {
    fetch(`../../mvc/controllers/administrator/dar_de_alta_nino.php?id=${idNino}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            obtenerNinosActivos(); // Actualizar la tabla de niños activos
            obtenerNinosInactivos(); // Actualizar la tabla de niños inactivos
        } else {
            alert(data.message); // Mostrar el mensaje de error del servidor
        }
    })
    .catch(error => {
        console.log('Error en la solicitud:', error);
        alert('Error al dar de alta al niño');
    });
}

// Función para abrir el modal de eliminar
function abrirModalEliminar(idNino) {
    const modalOverlayEliminar = document.querySelector('.modal-overlay-eliminar');
    const btnConfirmarEliminar = document.querySelector('.btn-confirmar-eliminar');

    modalOverlayEliminar.classList.add('active');

    btnConfirmarEliminar.onclick = function() {
        eliminarNino(idNino);
        modalOverlayEliminar.classList.remove('active');
    };

    document.querySelector('.btn-close-eliminar').onclick = function() {
        modalOverlayEliminar.classList.remove('active');
    };
}

// Función para eliminar a un niño
function eliminarNino(idNino) {
    fetch(`../../mvc/controllers/administrator/eliminar_nino.php?id=${idNino}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            obtenerNinosActivos(); // Actualizar la tabla de niños activos
            obtenerNinosInactivos(); // Actualizar la tabla de niños inactivos
        } else {
            alert(data.message); // Mostrar el mensaje de error del servidor
        }
    })
    .catch(error => {
        console.log('Error en la solicitud:', error);
        alert('Error al eliminar al niño');
    });
}

// Función para abrir el modal de editar grupo
function abrirModalEditarGrupo(idNino) {
    const modalOverlayEditarGrupo = document.querySelector('.modal-overlay-editar-grupo');
    const btnConfirmarEditarGrupo = document.querySelector('.btn-confirmar-editar-grupo');
    const selectGrupo = document.getElementById('select-grupo');

    // Limpiar el select antes de llenarlo
    selectGrupo.innerHTML = '';

    // Obtener los grupos disponibles
    fetch('../../mvc/controllers/administrator/obtener_grupos.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            data.grupos.forEach(grupo => {
                const option = document.createElement('option');
                option.value = grupo.id_grupo;
                option.textContent = grupo.nombre_grupo;
                selectGrupo.appendChild(option);
            });
        } else {
            alert(data.message); // Mostrar el mensaje de error del servidor
        }
    })
    .catch(error => {
        console.log('Error en la solicitud:', error);
        alert('Error al obtener los grupos');
    });

    modalOverlayEditarGrupo.classList.add('active');

    btnConfirmarEditarGrupo.onclick = function() {
        const idGrupoSeleccionado = selectGrupo.value;
        const nombreGrupoSeleccionado = selectGrupo.options[selectGrupo.selectedIndex].text;
        editarGrupoNino(idNino, idGrupoSeleccionado, nombreGrupoSeleccionado);
        modalOverlayEditarGrupo.classList.remove('active');
    };

    document.querySelector('.btn-close-editar-grupo').onclick = function() {
        modalOverlayEditarGrupo.classList.remove('active');
    };
}

// Función para editar el grupo de un niño
function editarGrupoNino(idNino, idGrupo, nombreGrupo) {
    fetch(`../../mvc/controllers/administrator/editar_grupo_nino.php?id=${idNino}&grupo=${idGrupo}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            obtenerNinosActivos(); // Actualizar la tabla de niños activos
            mostrarPopupConfirmacion(`Campista asignado al grupo ${nombreGrupo}`);
        } else {
            alert(data.message); // Mostrar el mensaje de error del servidor
        }
    })
    .catch(error => {
        console.log('Error en la solicitud:', error);
        alert('Error al editar el grupo del niño');
    });
}

// Función para obtener los grupos y mostrarlos en la tabla
function obtenerGrupos() {
    fetch('../../mvc/controllers/administrator/obtener_grupos.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            const tbody = document.querySelector('.full-height-table-grupos tbody');
            tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

            data.grupos.forEach(grupo => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="grupo-nombre">${grupo.nombre_grupo}</div>
                        <div class="grupo-botones">
                            <button id="grps-btn-editar-${grupo.id_grupo}" class="grps-btn-editar">Editar</button>
                            <button id="grps-btn-info-${grupo.id_grupo}" class="grps-btn-info">Información</button>
                            <button id="grps-btn-borrar-${grupo.id_grupo}" class="grps-btn-borrar">Borrar</button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Añadir evento a los botones de editar grupo
            document.querySelectorAll('.grps-btn-editar').forEach(button => {
                button.addEventListener('click', function() {
                    const idGrupo = this.id.split('-').pop();
                    const nombreGrupo = this.closest('tr').querySelector('.grupo-nombre').textContent;
                    abrirModalEditGroup(idGrupo, nombreGrupo);
                });
            });

            // Añadir evento a los botones de borrar grupo
            document.querySelectorAll('.grps-btn-borrar').forEach(button => {
                button.addEventListener('click', function() {
                    const idGrupo = this.id.split('-').pop();
                    abrirModalDeleteGroup(idGrupo);
                });
            });

            // Añadir evento a los botones de información del grupo
            document.querySelectorAll('.grps-btn-info').forEach(button => {
                button.addEventListener('click', function() {
                    const idGrupo = this.id.split('-').pop();
                    abrirModalInfoGroup(idGrupo);
                });
            });
        } else {
            console.error('Error:', data.message);
        }
    })
    .catch(error => {
        console.log('Error en la solicitud:', error);
        alert('Error al obtener los grupos');
    });
}

// Función para abrir el modal de añadir grupo
function abrirModalAddGroup() {
    const modalOverlayAddGroup = document.querySelector('.modal-overlay-add-group');
    const btnCloseAddGroup = document.querySelector('.btn-close-add-group');

    modalOverlayAddGroup.classList.add('active');

    btnCloseAddGroup.onclick = function() {
        modalOverlayAddGroup.classList.remove('active');
        limpiarFormularioAddGroup();
    };
}

// Función para limpiar el formulario de añadir grupo
function limpiarFormularioAddGroup() {
    const groupNameInput = document.getElementById('group-name');
    const errorMessage = groupNameInput.nextElementSibling;

    groupNameInput.value = '';
    errorMessage.textContent = '';
    errorMessage.classList.remove('error-visible');
}

// Función para validar el nombre del grupo
function validarNombreGrupo(nombre) {
    const regex = /^[a-zA-Z0-9\s]+$/;
    return nombre.trim() !== '' && regex.test(nombre);
}

// Función para añadir un grupo
function anadirGrupo(event) {
    event.preventDefault();

    const groupNameInput = document.getElementById('group-name');
    const groupName = groupNameInput.value.trim();
    const errorMessage = groupNameInput.nextElementSibling;

    if (!validarNombreGrupo(groupName)) {
        errorMessage.textContent = 'El nombre del grupo es obligatorio y no debe contener caracteres especiales.';
        errorMessage.classList.add('error-visible');
        return;
    }

    errorMessage.textContent = '';
    errorMessage.classList.remove('error-visible');

    // Enviar el grupo al servidor
    fetch('../../mvc/controllers/administrator/anadir_grupo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre_grupo: groupName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            obtenerGrupos(); // Actualizar la tabla de grupos
            document.querySelector('.modal-overlay-add-group').classList.remove('active');
            limpiarFormularioAddGroup(); // Limpiar el formulario después de añadir el grupo
        } else {
            alert(data.message); // Mostrar el mensaje de error del servidor
        }
    })
    .catch(error => {
        console.log('Error en la solicitud:', error);
        alert('Error al añadir el grupo');
    });
}

// Añadir evento al botón "Añadir Grupo"
document.getElementById('group-section-add-group').addEventListener('click', abrirModalAddGroup);

// Añadir evento al formulario de añadir grupo
document.getElementById('form-add-group').addEventListener('submit', anadirGrupo);

let grupoAEliminar = null;

// Función para abrir el modal de confirmación de eliminación
function abrirModalDeleteGroup(idGrupo) {
    grupoAEliminar = idGrupo;
    const modalOverlayDeleteGroup = document.querySelector('.modal-overlay-delete-group');
    const btnCloseDeleteGroup = document.querySelector('.btn-close-delete-group');
    const btnConfirmDeleteGroup = document.querySelector('.btn-confirm-delete-group');

    modalOverlayDeleteGroup.classList.add('active');

    btnCloseDeleteGroup.onclick = function() {
        modalOverlayDeleteGroup.classList.remove('active');
        grupoAEliminar = null;
    };

    btnConfirmDeleteGroup.onclick = function() {
        borrarGrupo();
    };
}

// Función para borrar un grupo
function borrarGrupo() {
    if (!grupoAEliminar) return;

    fetch(`../../mvc/controllers/administrator/borrar_grupo.php?id=${grupoAEliminar}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            obtenerGrupos(); // Actualizar la tabla de grupos
            document.querySelector('.modal-overlay-delete-group').classList.remove('active');
            grupoAEliminar = null;
        } else {
            alert(data.message); // Mostrar el mensaje de error del servidor
        }
    })
    .catch(error => {
        console.log('Error en la solicitud:', error);
        alert('Error al borrar el grupo');
    });
}

let grupoAEditar = null;

// Función para abrir el modal de edición de grupo
function abrirModalEditGroup(idGrupo, nombreGrupo) {
    grupoAEditar = idGrupo;
    const modalOverlayEditGroup = document.querySelector('.modal-overlay-edit-group');
    const btnCloseEditGroup = document.querySelector('.btn-close-edit-group');
    const groupNameInput = document.getElementById('edit-group-name');

    groupNameInput.value = nombreGrupo;
    modalOverlayEditGroup.classList.add('active');

    btnCloseEditGroup.onclick = function() {
        modalOverlayEditGroup.classList.remove('active');
        limpiarFormularioEditGroup();
    };
}

// Función para limpiar el formulario de edición de grupo
function limpiarFormularioEditGroup() {
    const groupNameInput = document.getElementById('edit-group-name');
    const errorMessage = groupNameInput.nextElementSibling;

    groupNameInput.value = '';
    errorMessage.textContent = '';
    errorMessage.classList.remove('error-visible');
}

// Función para validar el nombre del grupo
function validarNombreGrupo(nombre) {
    const regex = /^[a-zA-Z0-9\s]+$/;
    return nombre.trim() !== '' && regex.test(nombre);
}

// Función para editar un grupo
function editarGrupo(event) {
    event.preventDefault();

    const groupNameInput = document.getElementById('edit-group-name');
    const groupName = groupNameInput.value.trim();
    const errorMessage = groupNameInput.nextElementSibling;

    if (!validarNombreGrupo(groupName)) {
        errorMessage.textContent = 'El nombre del grupo es obligatorio y no debe contener caracteres especiales.';
        errorMessage.classList.add('error-visible');
        return;
    }

    errorMessage.textContent = '';
    errorMessage.classList.remove('error-visible');

    // Enviar la edición del grupo al servidor
    fetch(`../../mvc/controllers/administrator/editar_grupo.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_grupo: grupoAEditar, nombre_grupo: groupName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            obtenerGrupos(); // Actualizar la tabla de grupos
            document.querySelector('.modal-overlay-edit-group').classList.remove('active');
            limpiarFormularioEditGroup(); // Limpiar el formulario después de editar el grupo
        } else {
            alert(data.message); // Mostrar el mensaje de error del servidor
        }
    })
    .catch(error => {
        console.log('Error en la solicitud:', error);
        alert('Error al editar el grupo');
    });
}

// Función para abrir el modal de información del grupo
function abrirModalInfoGroup(idGrupo) {
    const modalOverlayInfoGroup = document.querySelector('.modal-overlay-info-group');
    const btnCloseInfoGroup = document.querySelector('.btn-close-info-group');
    const listaMonitores = document.getElementById('lista-monitores');
    const listaCampistas = document.getElementById('lista-campistas');

    // Limpiar las listas antes de llenarlas
    listaMonitores.innerHTML = '';
    listaCampistas.innerHTML = '';

    // Obtener la información del grupo desde el servidor
    fetch(`../../mvc/controllers/administrator/obtener_info_grupo.php?id=${idGrupo}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            // Llenar la lista de monitores
            data.monitores.forEach(monitor => {
                const li = document.createElement('li');
                li.textContent = `${monitor.nombre} ${monitor.apellido}`;
                listaMonitores.appendChild(li);
            });

            // Llenar la lista de campistas
            data.campistas.forEach(campista => {
                const li = document.createElement('li');
                li.textContent = `${campista.nombre} ${campista.apellido}`;
                listaCampistas.appendChild(li);
            });

            // Mostrar el modal
            modalOverlayInfoGroup.classList.add('active');
        } else {
            alert(data.message); // Mostrar el mensaje de error del servidor
        }
    })
    .catch(error => {
        console.log('Error en la solicitud:', error);
        alert('Error al obtener la información del grupo');
    });

    btnCloseInfoGroup.onclick = function() {
        modalOverlayInfoGroup.classList.remove('active');
    };
}

// Añadir evento a los botones de información del grupo
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.grps-btn-info').forEach(button => {
        button.addEventListener('click', function() {
            const idGrupo = this.id.split('-').pop();
            abrirModalInfoGroup(idGrupo);
        });
    });
});

// Añadir evento al formulario de editar grupo
document.getElementById('form-edit-group').addEventListener('submit', editarGrupo);

// Función para obtener los monitores y mostrarlos en la tabla
function mntrsGrpObtenerMonitores() {
    fetch('../../mvc/controllers/administrator/monitores.php')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('.full-height-table-monitores tbody');
            if (!tbody) return;
            tbody.innerHTML = '';

            data.forEach(monitor => {
                const fila = document.createElement('tr');
                const columna = document.createElement('td');

                const nombreApellido = document.createElement('div');
                nombreApellido.textContent = `${monitor.nombre} ${monitor.apellido}`;

                const contenedorBotones = document.createElement('div');
                contenedorBotones.classList.add('mntrs-grp-buttons');

                const btnEditar = document.createElement('button');
                btnEditar.id = `mntrs-grp-edit-${monitor.id_monitor}`;
                btnEditar.classList.add('mntrs-grp-btn-edit');
                btnEditar.textContent = 'Editar Grupo';
                btnEditar.addEventListener('click', () => abrirModalEditarMonitor(monitor.id_monitor));

                const btnInfo = document.createElement('button');
                btnInfo.id = `mntrs-grp-info-${monitor.id_monitor}`;
                btnInfo.classList.add('mntrs-grp-btn-info');
                btnInfo.textContent = 'Información';
                btnInfo.addEventListener('click', () => abrirModalInfoMonitor(monitor.id_monitor));

                const btnEliminar = document.createElement('button');
                btnEliminar.id = `mntrs-grp-delete-${monitor.id_monitor}`;
                btnEliminar.classList.add('mntrs-grp-btn-delete');
                btnEliminar.textContent = 'Eliminar';
                btnEliminar.addEventListener('click', () => abrirModalEliminarMonitor(monitor.id_monitor));

                contenedorBotones.appendChild(btnEditar);
                contenedorBotones.appendChild(btnInfo);
                contenedorBotones.appendChild(btnEliminar);

                columna.appendChild(nombreApellido);
                columna.appendChild(contenedorBotones);
                fila.appendChild(columna);
                tbody.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al obtener monitores:', error);
        });
}

// Función para abrir el modal de editar grupo del monitor
function abrirModalEditarMonitor(idMonitor) {
    const modalOverlayEditMonitor = document.querySelector('.modal-overlay-edit-monitor');
    const btnConfirmarEditMonitor = document.querySelector('.btn-confirmar-edit-monitor');
    const selectGrupoMonitor = document.getElementById('select-grupo-monitor');

    // Limpiar el select antes de llenarlo
    selectGrupoMonitor.innerHTML = '';

    // Obtener los grupos disponibles
    fetch('../../mvc/controllers/administrator/obtener_grupos.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            data.grupos.forEach(grupo => {
                const option = document.createElement('option');
                option.value = grupo.id_grupo;
                option.textContent = grupo.nombre_grupo;
                selectGrupoMonitor.appendChild(option);
            });
        } else {
            alert('Error al obtener los grupos');
        }
    })
    .catch(error => {
        console.error('Error al obtener los grupos:', error);
    });

    modalOverlayEditMonitor.classList.add('active');

    btnConfirmarEditMonitor.onclick = function() {
        const idGrupoSeleccionado = selectGrupoMonitor.value;
        const nombreGrupoSeleccionado = selectGrupoMonitor.options[selectGrupoMonitor.selectedIndex].text;
        editarGrupoMonitor(idMonitor, idGrupoSeleccionado, nombreGrupoSeleccionado);
        modalOverlayEditMonitor.classList.remove('active');
    };

    document.querySelector('.btn-close-edit-monitor').onclick = function() {
        modalOverlayEditMonitor.classList.remove('active');
    };
}

// Función para editar el grupo del monitor
function editarGrupoMonitor(idMonitor, idGrupo, nombreGrupo) {
    fetch(`../../mvc/controllers/administrator/editar_grupo_monitor.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_monitor: idMonitor, id_grupo: idGrupo })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            mostrarPopupExito(`Monitor añadido al grupo ${nombreGrupo}`);
            mntrsGrpObtenerMonitores(); // Actualizar la tabla de monitores
        } else {
            alert('Error al editar el grupo del monitor');
        }
    })
    .catch(error => {
        console.error('Error al editar el grupo del monitor:', error);
    });
}

// Función para mostrar el pop-up de éxito
function mostrarPopupExito(mensaje) {
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.textContent = mensaje;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('show');
    }, 100);

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 500);
    }, 1500);
}

// Función para abrir el modal de información del monitor
function abrirModalInfoMonitor(idMonitor) {
    const modalOverlayInfoMonitor = document.querySelector('.modal-overlay-info-monitor');
    const infoMonitorContent = document.getElementById('info-monitor-content');

    // Limpiar el contenido antes de llenarlo
    infoMonitorContent.innerHTML = '';

    // Obtener los datos del monitor
    fetch(`../../mvc/controllers/administrator/obtener_info_monitor.php?id=${idMonitor}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            const monitor = data.monitor;
            const nombre = monitor.nombre || 'No hay datos aquí';
            const apellido = monitor.apellido || 'No hay datos aquí';
            const dni = monitor.dni_monitor || 'No hay datos aquí';
            const telefono = monitor.numero_telefono || 'No hay datos aquí';

            infoMonitorContent.innerHTML = `
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Apellido:</strong> ${apellido}</p>
                <p><strong>DNI:</strong> ${dni}</p>
                <p><strong>Teléfono:</strong> ${telefono}</p>
            `;
        } else {
            infoMonitorContent.innerHTML = '<p>Error al obtener la información del monitor</p>';
        }
    })
    .catch(error => {
        console.error('Error al obtener la información del monitor:', error);
        infoMonitorContent.innerHTML = '<p>Error al obtener la información del monitor</p>';
    });

    modalOverlayInfoMonitor.classList.add('active');

    document.querySelector('.btn-close-info-monitor').onclick = function() {
        modalOverlayInfoMonitor.classList.remove('active');
    };
}

// Función para abrir el modal de eliminar monitor
function abrirModalEliminarMonitor(idMonitor) {
    const modalOverlayDeleteMonitor = document.querySelector('.modal-overlay-delete-monitor');
    const btnConfirmarDeleteMonitor = document.querySelector('.btn-confirmar-delete-monitor');

    modalOverlayDeleteMonitor.classList.add('active');

    btnConfirmarDeleteMonitor.onclick = function() {
        eliminarMonitor(idMonitor);
        modalOverlayDeleteMonitor.classList.remove('active');
    };

    document.querySelector('.btn-close-delete-monitor').onclick = function() {
        modalOverlayDeleteMonitor.classList.remove('active');
    };
}

// Función para eliminar el monitor
function eliminarMonitor(idMonitor) {
    fetch(`../../mvc/controllers/administrator/eliminar_monitor.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_monitor: idMonitor })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            mostrarPopupExito('Monitor eliminado correctamente');
            mntrsGrpObtenerMonitores(); // Actualizar la tabla de monitores
        } else {
            alert('Error al eliminar el monitor');
        }
    })
    .catch(error => {
        console.error('Error al eliminar el monitor:', error);
    });
}

// Función para abrir el modal de añadir monitor
function abrirModalAddMonitor() {
    const modalOverlayAddMonitor = document.querySelector('.modal-overlay-add-monitor');
    const btnCloseAddMonitor = document.querySelector('.btn-close-add-monitor');

    modalOverlayAddMonitor.classList.add('active');

    btnCloseAddMonitor.onclick = function() {
        modalOverlayAddMonitor.classList.remove('active');
        limpiarFormularioAddMonitor();
    };
}

// Función para limpiar el formulario de añadir monitor
function limpiarFormularioAddMonitor() {
    document.getElementById('form-add-monitor').reset();
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

// Añadir evento al botón "Añadir Monitor"
document.getElementById('group-section-add-monitor').addEventListener('click', abrirModalAddMonitor);

// Función para validar el formulario de añadir monitor
function validarFormularioAddMonitor() {
    let isValid = true;
    const formAddMonitor = document.getElementById('form-add-monitor');
    const formData = new FormData(formAddMonitor);

    // Validaciones
    const username = formData.get('username');
    const nombre = formData.get('nombre');
    const apellido = formData.get('apellido');
    const dni = formData.get('dni');
    const correo = formData.get('correo');
    const contrasena = formData.get('contrasena');

    // Validar Nombre de Usuario
    if (!username) {
        mostrarError('add-username', 'El usuario no puede estar vacío');
        isValid = false;
    } else if (/\s/.test(username)) {
        mostrarError('add-username', 'El usuario no puede tener espacios en blanco');
        isValid = false;
    } else if (/[^a-zA-Z0-9]/.test(username)) {
        mostrarError('add-username', 'El usuario no puede tener caracteres especiales');
        isValid = false;
    } else if (username.length < 6) {
        mostrarError('add-username', 'El usuario debe tener mínimo 6 caracteres');
        isValid = false;
    } else {
        // Verificar si el nombre de usuario ya existe
        fetch(`../../mvc/controllers/administrator/verificar_usuario.php?username=${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    mostrarError('add-username', 'El nombre de usuario ya existe');
                    isValid = false;
                } else {
                    ocultarError('add-username');
                }
            })
            .catch(error => {
                console.error('Error al verificar el nombre de usuario:', error);
                mostrarError('add-username', 'Error al verificar el nombre de usuario');
                isValid = false;
            });
    }

    // Validar Nombre
    if (!nombre) {
        mostrarError('add-nombre', 'El nombre no puede estar vacío');
        isValid = false;
    } else if (/\s/.test(nombre)) {
        mostrarError('add-nombre', 'El nombre no puede tener espacios en blanco');
        isValid = false;
    } else if (/\d/.test(nombre)) {
        mostrarError('add-nombre', 'El nombre no puede contener números');
        isValid = false;
    } else if (/[^a-zA-Z]/.test(nombre)) {
        mostrarError('add-nombre', 'El nombre no puede tener caracteres especiales');
        isValid = false;
    } else {
        ocultarError('add-nombre');
    }

    // Validar Apellido
    if (!apellido) {
        mostrarError('add-apellido', 'El apellido no puede estar vacío');
        isValid = false;
    } else if (/\s/.test(apellido)) {
        mostrarError('add-apellido', 'El apellido no puede tener espacios en blanco');
        isValid = false;
    } else if (/\d/.test(apellido)) {
        mostrarError('add-apellido', 'El apellido no puede contener números');
        isValid = false;
    } else if (/[^a-zA-Z]/.test(apellido)) {
        mostrarError('add-apellido', 'El apellido no puede tener caracteres especiales');
        isValid = false;
    } else {
        ocultarError('add-apellido');
    }

    // Validar DNI
    if (!dni) {
        mostrarError('add-dni', 'El DNI no puede estar vacío');
        isValid = false;
    } else if (/\s/.test(dni)) {
        mostrarError('add-dni', 'El DNI no puede tener espacios');
        isValid = false;
    } else if (!/^\d{8}[A-Z]$/.test(dni)) {
        mostrarError('add-dni', 'El DNI debe contener 8 números y 1 letra mayúscula');
        isValid = false;
    } else {
        ocultarError('add-dni');
    }

    // Validar Correo Electrónico
    if (!correo) {
        mostrarError('add-correo', 'El correo no puede estar vacío');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        mostrarError('add-correo', 'Escriba correctamente el correo');
        isValid = false;
    } else {
        ocultarError('add-correo');
    }

    // Validar Contraseña
    if (!contrasena) {
        mostrarError('add-contrasena', 'La contraseña no puede estar vacía');
        isValid = false;
    } else if (/\s/.test(contrasena)) {
        mostrarError('add-contrasena', 'La contraseña no puede tener espacios');
        isValid = false;
    } else if (contrasena.length < 6) {
        mostrarError('add-contrasena', 'La contraseña debe tener 6 caracteres');
        isValid = false;
    } else if (!/\d/.test(contrasena)) {
        mostrarError('add-contrasena', 'La contraseña debe contener 1 número');
        isValid = false;
    } else if (!/[A-Z]/.test(contrasena)) {
        mostrarError('add-contrasena', 'La contraseña debe contener 1 letra mayúscula');
        isValid = false;
    } else if (!/[a-z]/.test(contrasena)) {
        mostrarError('add-contrasena', 'La contraseña debe contener 1 letra minúscula');
        isValid = false;
    } else {
        ocultarError('add-contrasena');
    }

    return isValid;
}

// Función para validar un campo específico del formulario de añadir monitor
function validarCampoAddMonitor(campo) {
    const formAddMonitor = document.getElementById('form-add-monitor');
    const formData = new FormData(formAddMonitor);
    const valor = formData.get(campo);

    switch (campo) {
        case 'username':
            if (!valor) {
                mostrarError('add-username', 'El usuario no puede estar vacío');
            } else if (/\s/.test(valor)) {
                mostrarError('add-username', 'El usuario no puede tener espacios en blanco');
            } else if (/[^a-zA-Z0-9]/.test(valor)) {
                mostrarError('add-username', 'El usuario no puede tener caracteres especiales');
            } else if (valor.length < 6) {
                mostrarError('add-username', 'El usuario debe tener mínimo 6 caracteres');
            } else {
                // Verificar si el nombre de usuario ya existe
                fetch(`../../mvc/controllers/administrator/verificar_usuario.php?username=${valor}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.exists) {
                            mostrarError('add-username', 'El nombre de usuario ya existe');
                        } else {
                            ocultarError('add-username');
                        }
                    })
                    .catch(error => {
                        console.error('Error al verificar el nombre de usuario:', error);
                        mostrarError('add-username', 'Error al verificar el nombre de usuario');
                    });
            }
            break;
        case 'nombre':
            if (!valor) {
                mostrarError('add-nombre', 'El nombre no puede estar vacío');
            } else if (/\s/.test(valor)) {
                mostrarError('add-nombre', 'El nombre no puede tener espacios en blanco');
            } else if (/\d/.test(valor)) {
                mostrarError('add-nombre', 'El nombre no puede contener números');
            } else if (/[^a-zA-Z]/.test(valor)) {
                mostrarError('add-nombre', 'El nombre no puede tener caracteres especiales');
            } else {
                ocultarError('add-nombre');
            }
            break;
        case 'apellido':
            if (!valor) {
                mostrarError('add-apellido', 'El apellido no puede estar vacío');
            } else if (/\s/.test(valor)) {
                mostrarError('add-apellido', 'El apellido no puede tener espacios en blanco');
            } else if (/\d/.test(valor)) {
                mostrarError('add-apellido', 'El apellido no puede contener números');
            } else if (/[^a-zA-Z]/.test(valor)) {
                mostrarError('add-apellido', 'El apellido no puede tener caracteres especiales');
            } else {
                ocultarError('add-apellido');
            }
            break;
        case 'dni':
            if (!valor) {
                mostrarError('add-dni', 'El DNI no puede estar vacío');
            } else if (/\s/.test(valor)) {
                mostrarError('add-dni', 'El DNI no puede tener espacios');
            } else if (!/^\d{8}[A-Z]$/.test(valor)) {
                mostrarError('add-dni', 'El DNI debe contener 8 números y 1 letra mayúscula');
            } else {
                ocultarError('add-dni');
            }
            break;
        case 'correo':
            if (!valor) {
                mostrarError('add-correo', 'El correo no puede estar vacío');
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                mostrarError('add-correo', 'Escriba correctamente el correo');
            } else {
                ocultarError('add-correo');
            }
            break;
        case 'contrasena':
            if (!valor) {
                mostrarError('add-contrasena', 'La contraseña no puede estar vacía');
            } else if (/\s/.test(valor)) {
                mostrarError('add-contrasena', 'La contraseña no puede tener espacios');
            } else if (valor.length < 6) {
                mostrarError('add-contrasena', 'La contraseña debe tener 6 caracteres');
            } else if (!/\d/.test(valor)) {
                mostrarError('add-contrasena', 'La contraseña debe contener 1 número');
            } else if (!/[A-Z]/.test(valor)) {
                mostrarError('add-contrasena', 'La contraseña debe contener 1 letra mayúscula');
            } else if (!/[a-z]/.test(valor)) {
                mostrarError('add-contrasena', 'La contraseña debe contener 1 letra minúscula');
            } else {
                ocultarError('add-contrasena');
            }
            break;
        case 'telefono':
            if (!valor) {
                mostrarError('add-telefono', 'El teléfono no puede estar vacío');
            } else if (!/^\d{9}$/.test(valor)) {
                mostrarError('add-telefono', 'El teléfono debe tener 9 dígitos');
            } else {
                ocultarError('add-telefono');
            }
            break;
    }
}

// Añadir eventos blur a los campos del formulario
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-username').addEventListener('blur', () => validarCampoAddMonitor('username'));
    document.getElementById('add-nombre').addEventListener('blur', () => validarCampoAddMonitor('nombre'));
    document.getElementById('add-apellido').addEventListener('blur', () => validarCampoAddMonitor('apellido'));
    document.getElementById('add-dni').addEventListener('blur', () => validarCampoAddMonitor('dni'));
    document.getElementById('add-correo').addEventListener('blur', () => validarCampoAddMonitor('correo'));
    document.getElementById('add-contrasena').addEventListener('blur', () => validarCampoAddMonitor('contrasena'));
    document.getElementById('add-telefono').addEventListener('blur', () => validarCampoAddMonitor('telefono'));
});

// Función para añadir un monitor
function anadirMonitor(event) {
    event.preventDefault();

    if (!validarFormularioAddMonitor()) {
        mostrarErrorGeneral('Complete todos los campos correctamente');
        return;
    }

    const formAddMonitor = document.getElementById('form-add-monitor');
    const formData = new FormData(formAddMonitor);
    const data = {
        username: formData.get('username'),
        nombre: formData.get('nombre'),
        apellido: formData.get('apellido'),
        dni: formData.get('dni'),
        telefono: formData.get('telefono'),
        correo: formData.get('correo'),
        contrasena: formData.get('contrasena')
    };

    fetch('../../mvc/controllers/administrator/anadir_monitor.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            mostrarPopupExito('Monitor añadido correctamente');
            mntrsGrpObtenerMonitores(); // Actualizar la tabla de monitores
            document.querySelector('.modal-overlay-add-monitor').classList.remove('active');
            limpiarFormularioAddMonitor(); // Limpiar el formulario después de añadir el monitor
        } else {
            alert(data.message); // Mostrar el mensaje de error del servidor
        }
    })
    .catch(error => {
        console.error('Error al añadir el monitor:', error);
    });
}

// Función para mostrar mensaje de error general
function mostrarErrorGeneral(mensaje) {
    const errorGeneralElement = document.getElementById('error-general');
    if (errorGeneralElement) {
        errorGeneralElement.textContent = mensaje;
        errorGeneralElement.style.display = 'block';
    }
}

// Añadir evento al formulario de añadir monitor
document.getElementById('form-add-monitor').addEventListener('submit', anadirMonitor);

// Llamar a las funciones cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    obtenerDatosAdministrator();
    actualizarFotoPerfil();
    obtenerNotificaciones();
    obtenerNinosActivos(); // Llamar a la función para obtener los niños activos
    obtenerNinosInactivos(); // Llamar a la función para obtener los niños inactivos
    obtenerGrupos();

    // Agregar evento al botón "Editar información"
    const editInfoButton = document.querySelector('.edit-info-btn');
    editInfoButton.addEventListener('click', function() {
        abrirModalEditarPerfil();
    });

    // Validar y enviar el formulario de edición de perfil
    const formEditarPerfil = document.getElementById('form-editar-perfil');
    formEditarPerfil.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío del formulario

        // Validar los campos del formulario
        const nombreValido = validarNombre();
        const apellidoValido = validarApellido();
        const dniValido = validarDNI();
        const telefonoValido = validarTelefono();
        const correoValido = validarCorreo();

        if (nombreValido && apellidoValido && dniValido && telefonoValido && correoValido) {
            // Enviar el formulario si todos los campos son válidos
            const formData = new FormData(formEditarPerfil);

            fetch('../../mvc/controllers/administrator/actualizar_perfil.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    // Actualizar los datos en la interfaz de usuario
                    document.getElementById('full-name').textContent = `${formData.get('nombre')} ${formData.get('apellido')}`;
                    document.getElementById('dni').textContent = formData.get('dni');
                    document.getElementById('phone').textContent = formData.get('telefono');
                    document.getElementById('email').textContent = formData.get('correo');

                    // Cerrar el modal
                    const modalOverlayProfile = document.querySelector('.modal-overlay-profile');
                    modalOverlayProfile.classList.remove('active');

                    // Mostrar el pop-up de éxito
                    mostrarPopupExito('Perfil actualizado correctamente');
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.log(error);
                alert('Error al actualizar el perfil');
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    mntrsGrpObtenerMonitores();
});

// Función para mostrar mensajes de error
function mostrarError(campo, mensaje) {
    const errorElement = document.getElementById(`${campo}-error`);
    if (errorElement) {
        errorElement.textContent = mensaje;
        errorElement.style.display = 'block';
    } else {
        console.error(`No se encontró el elemento de error para el campo: ${campo}`);
    }
}

// Función para ocultar mensajes de error
function ocultarError(campo) {
    const errorElement = document.getElementById(`${campo}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    } else {
        console.error(`No se encontró el elemento de error para el campo: ${campo}`);
    }
}

// Función para mostrar el pop-up de error
function mostrarPopupError(mensaje) {
    const popupError = document.getElementById('popup-error');
    const popupErrorMessage = document.getElementById('popup-error-message');
    if (popupError && popupErrorMessage) {
        popupErrorMessage.textContent = mensaje;
        popupError.classList.add('active');
        setTimeout(() => {
            popupError.classList.remove('active');
        }, 1000); // El pop-up se ocultará después de 5 segundos
    }
}

// Función para validar un campo específico del formulario de añadir monitor
function validarCampoAddMonitor(campo) {
    const formAddMonitor = document.getElementById('form-add-monitor');
    const formData = new FormData(formAddMonitor);
    const valor = formData.get(campo);

    switch (campo) {
        case 'username':
            if (!valor) {
                mostrarError('add-username', 'El usuario no puede estar vacío');
            } else if (/\s/.test(valor)) {
                mostrarError('add-username', 'El usuario no puede tener espacios en blanco');
            } else if (/[^a-zA-Z0-9]/.test(valor)) {
                mostrarError('add-username', 'El usuario no puede tener caracteres especiales');
            } else if (valor.length < 6) {
                mostrarError('add-username', 'El usuario debe tener mínimo 6 caracteres');
            } else {
                fetch(`../../mvc/controllers/administrator/verificar_usuario.php?username=${valor}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.exists) {
                            mostrarError('add-username', 'El nombre de usuario ya existe');
                        } else {
                            ocultarError('add-username');
                        }
                    })
                    .catch(error => {
                        console.error('Error al verificar el nombre de usuario:', error);
                        mostrarPopupError('Error al verificar el nombre de usuario'); // Mostrar el mensaje de error en el pop-up
                    });
            }
            break;
        case 'nombre':
            if (!valor) {
                mostrarError('add-nombre', 'El nombre no puede estar vacío');
            } else if (/\s/.test(valor)) {
                mostrarError('add-nombre', 'El nombre no puede tener espacios en blanco');
            } else if (/\d/.test(valor)) {
                mostrarError('add-nombre', 'El nombre no puede contener números');
            } else if (/[^a-zA-Z]/.test(valor)) {
                mostrarError('add-nombre', 'El nombre no puede tener caracteres especiales');
            } else {
                ocultarError('add-nombre');
            }
            break;
        case 'apellido':
            if (!valor) {
                mostrarError('add-apellido', 'El apellido no puede estar vacío');
            } else if (/\s/.test(valor)) {
                mostrarError('add-apellido', 'El apellido no puede tener espacios en blanco');
            } else if (/\d/.test(valor)) {
                mostrarError('add-apellido', 'El apellido no puede contener números');
            } else if (/[^a-zA-Z]/.test(valor)) {
                mostrarError('add-apellido', 'El apellido no puede tener caracteres especiales');
            } else {
                ocultarError('add-apellido');
            }
            break;
        case 'dni':
            if (!valor) {
                mostrarError('add-dni', 'El DNI no puede estar vacío');
            } else if (/\s/.test(valor)) {
                mostrarError('add-dni', 'El DNI no puede tener espacios');
            } else if (!/^\d{8}[A-Z]$/.test(valor)) {
                mostrarError('add-dni', 'El DNI debe contener 8 números y 1 letra mayúscula');
            } else {
                ocultarError('add-dni');
            }
            break;
        case 'correo':
            if (!valor) {
                mostrarError('add-correo', 'El correo no puede estar vacío');
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                mostrarError('add-correo', 'Escriba correctamente el correo');
            } else {
                ocultarError('add-correo');
            }
            break;
        case 'contrasena':
            if (!valor) {
                mostrarError('add-contrasena', 'La contraseña no puede estar vacía');
            } else if (/\s/.test(valor)) {
                mostrarError('add-contrasena', 'La contraseña no puede tener espacios');
            } else if (valor.length < 6) {
                mostrarError('add-contrasena', 'La contraseña debe tener 6 caracteres');
            } else if (!/\d/.test(valor)) {
                mostrarError('add-contrasena', 'La contraseña debe contener 1 número');
            } else if (!/[A-Z]/.test(valor)) {
                mostrarError('add-contrasena', 'La contraseña debe contener 1 letra mayúscula');
            } else if (!/[a-z]/.test(valor)) {
                mostrarError('add-contrasena', 'La contraseña debe contener 1 letra minúscula');
            } else {
                ocultarError('add-contrasena');
            }
            break;
        case 'telefono':
            if (!valor) {
                mostrarError('add-telefono', 'El teléfono no puede estar vacío');
            } else if (!/^\d{9}$/.test(valor)) {
                mostrarError('add-telefono', 'El teléfono debe tener 9 dígitos');
            } else {
                ocultarError('add-telefono');
            }
            break;
    }
}

// Función para validar todo el formulario
function validarFormularioAddMonitor() {
    const campos = ['username', 'nombre', 'apellido', 'dni', 'telefono', 'correo', 'contrasena'];
    let formularioValido = true;

    campos.forEach(campo => {
        validarCampoAddMonitor(campo);
        const errorElement = document.getElementById(`${campo}-error`);
        if (errorElement && errorElement.textContent !== '') {
            formularioValido = false;
        }
    });

    return formularioValido;
}

// Función para añadir un monitor
function anadirMonitor(event) {
    event.preventDefault();

    if (!validarFormularioAddMonitor()) {
        mostrarErrorGeneral('Complete todos los campos correctamente');
        return;
    }

    const formAddMonitor = document.getElementById('form-add-monitor');
    const formData = new FormData(formAddMonitor);
    const data = {
        username: formData.get('username'),
        nombre: formData.get('nombre'),
        apellido: formData.get('apellido'),
        dni: formData.get('dni'),
        telefono: formData.get('telefono'),
        correo: formData.get('correo'),
        contrasena: formData.get('contrasena')
    };

    fetch('../../mvc/controllers/administrator/anadir_monitor.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            mostrarPopupExito('Monitor añadido correctamente');
            mntrsGrpObtenerMonitores(); // Actualizar la tabla de monitores
            document.querySelector('.modal-overlay-add-monitor').classList.remove('active');
            limpiarFormularioAddMonitor(); // Limpiar el formulario después de añadir el monitor
        } else {
            mostrarPopupError(data.message); // Mostrar el mensaje de error en el pop-up
        }
    })
    .catch(error => {
        console.error('Error al añadir el monitor:', error);
        mostrarPopupError('Error al añadir el monitor'); // Mostrar un mensaje de error genérico en el pop-up
    });
}

// Función para mostrar mensaje de error general
function mostrarErrorGeneral(mensaje) {
    const errorGeneralElement = document.getElementById('error-general');
    if (errorGeneralElement) {
        errorGeneralElement.textContent = mensaje;
        errorGeneralElement.style.display = 'block';
    }
}

// Añadir eventos blur a los campos del formulario
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-username').addEventListener('blur', () => validarCampoAddMonitor('username'));
    document.getElementById('add-nombre').addEventListener('blur', () => validarCampoAddMonitor('nombre'));
    document.getElementById('add-apellido').addEventListener('blur', () => validarCampoAddMonitor('apellido'));
    document.getElementById('add-dni').addEventListener('blur', () => validarCampoAddMonitor('dni'));
    document.getElementById('add-correo').addEventListener('blur', () => validarCampoAddMonitor('correo'));
    document.getElementById('add-contrasena').addEventListener('blur', () => validarCampoAddMonitor('contrasena'));
    document.getElementById('add-telefono').addEventListener('blur', () => validarCampoAddMonitor('telefono'));

    // Añadir evento al formulario de añadir monitor
    document.getElementById('form-add-monitor').addEventListener('submit', anadirMonitor);
});

