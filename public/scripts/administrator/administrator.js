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
            const fichaMedica = data.fichaMedica;
            const guardian = data.guardian;

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
        console.log('Error en la solicitud:', error);
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

// Llamar a las funciones cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    obtenerDatosAdministrator();
    actualizarFotoPerfil();
    obtenerNotificaciones();
    obtenerNinosActivos(); // Llamar a la función para obtener los niños activos
    obtenerNinosInactivos(); // Llamar a la función para obtener los niños inactivos

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

