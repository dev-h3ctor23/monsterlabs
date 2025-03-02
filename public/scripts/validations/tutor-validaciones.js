document.addEventListener('DOMContentLoaded', () => {
    // Validación de finalización de registro de padre
    const formPadre = document.getElementById('form-inscripcion-padre');
    if (formPadre) {
        formPadre.addEventListener('submit', function(event) {
            event.preventDefault();
            validarFormularioPadre();
        });

        const inputsPadre = ['nombre-padre', 'apellidos-padre', 'dni-padre', 'telefono-padre'];
        inputsPadre.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                const errorDiv = document.createElement('div');
                errorDiv.id = `${id.replace('-padre', '')}-error`;
                errorDiv.style.color = 'red';
                errorDiv.style.fontSize = '12px';
                errorDiv.style.marginTop = '5px';
                errorDiv.style.display = 'none';
                input.insertAdjacentElement('afterend', errorDiv);

                input.addEventListener('blur', () => validarInputPadre(input));
                input.addEventListener('input', () => validarInputPadre(input)); // Validación en tiempo real
            }
        });

        function validarFormularioPadre() {
            let isValid = true;
            inputsPadre.forEach(id => {
                const input = document.getElementById(id);
                if (input && !validarInputPadre(input)) {
                    isValid = false;
                }
            });
            if (isValid) {
                formPadre.submit();
            }
        }

        function validarInputPadre(input) {
            const value = input.value.trim();
            const errorDiv = document.getElementById(`${input.id.replace('-padre', '')}-error`);
            const nombreApellidoRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;

            if (!value) {
                errorDiv.textContent = 'Este campo es obligatorio.';
                errorDiv.style.display = 'block';
                return false;
            }

            if (input.id === 'nombre-padre' && !nombreApellidoRegex.test(value)) {
                errorDiv.textContent = 'El nombre solo puede contener letras y espacios.';
                errorDiv.style.display = 'block';
                return false;
            } else if (input.id === 'apellidos-padre' && !nombreApellidoRegex.test(value)) {
                errorDiv.textContent = 'Los apellidos solo pueden contener letras y espacios.';
                errorDiv.style.display = 'block';
                return false;
            } else if (input.id === 'dni-padre' && !/^[0-9]{8}[A-Za-z]$/.test(value)) {
                errorDiv.textContent = 'El DNI debe tener 8 dígitos seguidos de una letra (ej. 12345678A).';
                errorDiv.style.display = 'block';
                return false;
            } else if (input.id === 'telefono-padre' && !/^[0-9]{9}$/.test(value)) {
                errorDiv.textContent = 'El teléfono debe tener exactamente 9 dígitos.';
                errorDiv.style.display = 'block';
                return false;
            }
            errorDiv.style.display = 'none';
            return true;
        }
    }

    // Validación de la sección perfil
    const formPerfil = document.getElementById('formulario');
    if (formPerfil) {
        formPerfil.addEventListener('submit', function(event) {
            event.preventDefault();
            validarFormularioPerfil();
        });

        const inputsPerfil = ['inputUsuario', 'inputNombre', 'inputApellidos', 'inputDni', 'inputTelefono'];
        inputsPerfil.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                const errorDiv = document.createElement('div');
                errorDiv.id = `${id}-error`;
                errorDiv.style.color = 'red';
                errorDiv.style.fontSize = '12px';
                errorDiv.style.marginTop = '5px';
                errorDiv.style.display = 'none';
                input.insertAdjacentElement('afterend', errorDiv);

                input.addEventListener('blur', () => validarInputPerfil(input));
                input.addEventListener('input', () => validarInputPerfil(input)); // Validación en tiempo real
            }
        });

        function validarFormularioPerfil() {
            let isValid = true;
            inputsPerfil.forEach(id => {
                const input = document.getElementById(id);
                if (input && !validarInputPerfil(input)) {
                    isValid = false;
                }
            });
            if (isValid) {
                formPerfil.submit();
            }
        }

        function validarInputPerfil(input) {
            const value = input.value.trim();
            const errorDiv = document.getElementById(`${input.id}-error`);
            const nombreApellidoRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;

            if (!value) {
                errorDiv.textContent = 'Este campo es obligatorio.';
                errorDiv.style.display = 'block';
                return false;
            }

            if (input.id === 'inputUsuario' && value.length < 5) {
                errorDiv.textContent = 'El nombre de usuario debe tener al menos 5 caracteres.';
                errorDiv.style.display = 'block';
                return false;
            } else if (input.id === 'inputNombre' && !nombreApellidoRegex.test(value)) {
                errorDiv.textContent = 'El nombre solo puede contener letras y espacios.';
                errorDiv.style.display = 'block';
                return false;
            } else if (input.id === 'inputApellidos' && !nombreApellidoRegex.test(value)) {
                errorDiv.textContent = 'Los apellidos solo pueden contener letras y espacios.';
                errorDiv.style.display = 'block';
                return false;
            } else if (input.id === 'inputDni' && !/^[0-9]{8}[A-Za-z]$/.test(value)) {
                errorDiv.textContent = 'El DNI debe tener 8 dígitos seguidos de una letra (ej. 12345678A).';
                errorDiv.style.display = 'block';
                return false;
            } else if (input.id === 'inputTelefono' && !/^[0-9]{9}$/.test(value)) {
                errorDiv.textContent = 'El teléfono debe tener exactamente 9 dígitos.';
                errorDiv.style.display = 'block';
                return false;
            }
            errorDiv.style.display = 'none';
            return true;
        }
    }

    // Validación del formulario de edición de usuario
const formEditarUsuario = document.getElementById('formularioEditarUsario');
if (formEditarUsuario) {
    const submitButton = formEditarUsuario.querySelector('button[type="submit"]');
    submitButton.disabled = true; // Deshabilita el botón inicialmente

    // IDs de los inputs según el HTML
    const inputsEditarUsuario = [
        'inputUsuario',
        'inputNombrePadre',
        'inputApellidosPadre',
        'inputDniPadre',
        'inputTelefonoPadre'
    ];
    const errorMessage = document.getElementById('form-error');

    // Configuración de eventos en cada input
    inputsEditarUsuario.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            const errorDiv = document.createElement('div');
            errorDiv.id = `${id}-error`;
            errorDiv.style.color = 'red';
            errorDiv.style.fontSize = '12px';
            errorDiv.style.marginTop = '5px';
            errorDiv.style.display = 'none';
            input.insertAdjacentElement('afterend', errorDiv);

            input.addEventListener('blur', () => {
                validarInputEditarUsuario(input);
                updateSubmitButtonStatus();
            });
            input.addEventListener('input', () => {
                validarInputEditarUsuario(input);
                updateSubmitButtonStatus();
            });
        }
    });

    // Evento submit del formulario
    formEditarUsuario.addEventListener('submit', function(event) {
        event.preventDefault();
        if (isFormValid()) {
            errorMessage.style.display = 'none';
            // Aquí puedes llamar a la función para enviar el formulario, por ejemplo:
            // enviarFormularioEditarUsuario();
        } else {
            errorMessage.textContent = 'Por favor, llene todos los campos correctamente';
            errorMessage.style.display = 'inline';
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 3000);
        }
    });

    // Función que revisa si todos los inputs son válidos
    function isFormValid() {
        let valid = true;
        inputsEditarUsuario.forEach(id => {
            const input = document.getElementById(id);
            if (input && !validarInputEditarUsuario(input)) {
                valid = false;
            }
        });
        return valid;
    }

    // Actualiza el estado (habilitado/deshabilitado) del botón de envío
    function updateSubmitButtonStatus() {
        submitButton.disabled = !isFormValid();
    }

    // Función de validación individual para cada input
    function validarInputEditarUsuario(input) {
        const value = input.value.trim();
        const errorDiv = document.getElementById(`${input.id}-error`);
        const nombreApellidoRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;

        if (!value) {
            errorDiv.textContent = 'Este campo es obligatorio.';
            errorDiv.style.display = 'block';
            return false;
        }

        if (input.id === 'inputUsuario' && value.length < 5) {
            errorDiv.textContent = 'El nombre de usuario debe tener al menos 5 caracteres.';
            errorDiv.style.display = 'block';
            return false;
        } else if (input.id === 'inputNombrePadre' && !nombreApellidoRegex.test(value)) {
            errorDiv.textContent = 'El nombre solo puede contener letras y espacios.';
            errorDiv.style.display = 'block';
            return false;
        } else if (input.id === 'inputApellidosPadre' && !nombreApellidoRegex.test(value)) {
            errorDiv.textContent = 'Los apellidos solo pueden contener letras y espacios.';
            errorDiv.style.display = 'block';
            return false;
        } else if (input.id === 'inputDniPadre' && !/^[0-9]{8}[A-Za-z]$/.test(value)) {
            errorDiv.textContent = 'El DNI debe tener 8 dígitos seguidos de una letra (ej. 12345678A).';
            errorDiv.style.display = 'block';
            return false;
        } else if (input.id === 'inputTelefonoPadre' && !/^[0-9]{9}$/.test(value)) {
            errorDiv.textContent = 'El teléfono debe tener exactamente 9 dígitos.';
            errorDiv.style.display = 'block';
            return false;
        }
        errorDiv.style.display = 'none';
        return true;
    }
}


    // VALIDACIÓN DEL FORMULARIO DE INSCRIPCIÓN
  const formInscripcion = document.getElementById('form-inscripcion');
  if (formInscripcion) {
    formInscripcion.addEventListener('submit', function(event) {
      event.preventDefault();
      validarFormularioInscripcion();
    });

    // Validación de los campos principales de la inscripción
    const inputsInscripcion = ['nombre-nino', 'apellidos-nino', 'fecha-nacimiento', 'fecha-inicio', 'fecha-fin'];
    inputsInscripcion.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        const errorDiv = document.createElement('div');
        errorDiv.id = `${id}-error`;
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.display = 'none';
        input.insertAdjacentElement('afterend', errorDiv);

        input.addEventListener('blur', () => validarInputInscripcion(input));
        input.addEventListener('input', () => validarInputInscripcion(input));
      }
    });

    // Manejo del select para responsable adicional
    const selectResponsable = document.getElementById('responsable-adicional');
    const responsableInfo = document.getElementById('responsable-info');
    selectResponsable.addEventListener('change', () => {
      if (selectResponsable.value === 'si') {
        responsableInfo.classList.remove('hidden');
      } else {
        responsableInfo.classList.add('hidden');
      }
    });

    // Validación de los campos del responsable adicional
    const responsableFields = ['nombre-responsable', 'apellidos-responsable', 'dni-responsable', 'telefono-responsable', 'relacion-responsable'];
    responsableFields.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        const errorDiv = document.createElement('div');
        errorDiv.id = `${id}-error`;
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.display = 'none';
        input.insertAdjacentElement('afterend', errorDiv);

        input.addEventListener('blur', () => validarInputResponsable(input));
        input.addEventListener('input', () => validarInputResponsable(input));
      }
    });

    function validarFormularioInscripcion() {
      let isValid = true;
      // Validar campos principales
      inputsInscripcion.forEach(id => {
        const input = document.getElementById(id);
        if (input && !validarInputInscripcion(input)) {
          isValid = false;
        }
      });
      // Si se requiere responsable adicional, validarlo también
      if (selectResponsable.value === 'si') {
        responsableFields.forEach(id => {
          const input = document.getElementById(id);
          if (input && !validarInputResponsable(input)) {
            isValid = false;
          }
        });
      }
      if (isValid) {
        formInscripcion.submit();
      }
    }

    function validarInputInscripcion(input) {
      const value = input.value.trim();
      const errorDiv = document.getElementById(`${input.id}-error`);
      const nombreApellidoRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;

      if (!value) {
        errorDiv.textContent = 'Este campo es obligatorio.';
        errorDiv.style.display = 'block';
        return false;
      }

      if (input.id === 'nombre-nino' && !nombreApellidoRegex.test(value)) {
        errorDiv.textContent = 'El nombre solo puede contener letras y espacios.';
        errorDiv.style.display = 'block';
        return false;
      } else if (input.id === 'apellidos-nino' && !nombreApellidoRegex.test(value)) {
        errorDiv.textContent = 'Los apellidos solo pueden contener letras y espacios.';
        errorDiv.style.display = 'block';
        return false;
      } else if (input.id === 'fecha-nacimiento') {
        const fechaNacimiento = new Date(value);
        const hoy = new Date();
        const edadMinima = new Date(hoy.getFullYear() - 6, hoy.getMonth(), hoy.getDate());
        const edadMaxima = new Date(hoy.getFullYear() - 9, hoy.getMonth(), hoy.getDate());

        if (fechaNacimiento > hoy) {
          errorDiv.textContent = 'La fecha de nacimiento no puede ser futura.';
          errorDiv.style.display = 'block';
          return false;
        } else if (fechaNacimiento > edadMinima) {
          errorDiv.textContent = 'El niño debe tener al menos 6 años de edad.';
          errorDiv.style.display = 'block';
          return false;
        } else if (fechaNacimiento < edadMaxima) {
          errorDiv.textContent = 'El niño no puede tener más de 9 años de edad.';
          errorDiv.style.display = 'block';
          return false;
        }
      } else if (input.id === 'fecha-inicio' || input.id === 'fecha-fin') {
        const fecha = new Date(value);
        const año = fecha.getFullYear();
        // Se define el rango válido: del 1 de junio al 31 de agosto
        const fechaMinima = new Date(año, 5, 1); // 1 de junio (mes 5 porque enero es 0)
        const fechaMaxima = new Date(año, 7, 31); // 31 de agosto (mes 7 porque enero es 0)

        if (fecha < fechaMinima || fecha > fechaMaxima) {
          errorDiv.textContent = 'Las fechas deben estar entre el 1 de junio y el 31 de agosto.';
          errorDiv.style.display = 'block';
          return false;
        }
      }
      errorDiv.style.display = 'none';
      return true;
    }

    function validarInputResponsable(input) {
      const value = input.value.trim();
      const errorDiv = document.getElementById(`${input.id}-error`);
      const nombreApellidoRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;

      if (!value) {
        errorDiv.textContent = 'Este campo es obligatorio.';
        errorDiv.style.display = 'block';
        return false;
      }

      if (
        (input.id === 'nombre-responsable' ||
         input.id === 'apellidos-responsable' ||
         input.id === 'relacion-responsable') &&
        !nombreApellidoRegex.test(value)
      ) {
        errorDiv.textContent = 'Este campo solo puede contener letras y espacios.';
        errorDiv.style.display = 'block';
        return false;
      }

      if (input.id === 'dni-responsable' && !/^[0-9]{8}[A-Za-z]$/.test(value)) {
        errorDiv.textContent = 'El DNI debe tener 8 dígitos seguidos de una letra (ej. 12345678A).';
        errorDiv.style.display = 'block';
        return false;
      }

      if (input.id === 'telefono-responsable' && !/^[0-9]{9}$/.test(value)) {
        errorDiv.textContent = 'El teléfono debe tener exactamente 9 dígitos.';
        errorDiv.style.display = 'block';
        return false;
      }

      errorDiv.style.display = 'none';
      return true;
    }
  }

   // Validación del formulario de notificaciones
const formNotificaciones = document.getElementById('form-notificaciones');
if (formNotificaciones) {
    formNotificaciones.addEventListener('submit', function (event) {
        event.preventDefault();
        validarFormularioNotificaciones();
    });

    const inputsNotificaciones = ['asunto', 'descripcion', 'fecha'];
    inputsNotificaciones.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            const errorDiv = document.createElement('div');
            errorDiv.id = `${id}-error`;
            errorDiv.style.color = 'red';
            errorDiv.style.fontSize = '12px';
            errorDiv.style.marginTop = '5px';
            errorDiv.style.display = 'none';
            input.insertAdjacentElement('afterend', errorDiv);

            input.addEventListener('blur', () => validarInputNotificaciones(input));
            input.addEventListener('input', () => validarInputNotificaciones(input)); // Validación en tiempo real
        }
    });

    function validarFormularioNotificaciones() {
        let isValid = true;
        inputsNotificaciones.forEach(id => {
            const input = document.getElementById(id);
            if (input && !validarInputNotificaciones(input)) {
                isValid = false;
            }
        });
        // Si las validaciones son correctas, mostrar el mensaje de éxito
        if (isValid) {
            // Eliminar mensaje previo si existe
            const prevMessage = document.getElementById('success-message');
            if (prevMessage) {
                prevMessage.remove();
            }
            // Crear el mensaje de éxito
            const successMessage = document.createElement('div');
            successMessage.id = 'success-message';
            successMessage.textContent = 'Solicitud de contacto enviada exitosamente, el administrador lo contactará lo antes posible. Gracias.';
            successMessage.style.color = 'green';
            successMessage.style.fontSize = '14px';
            successMessage.style.marginTop = '10px';

            formNotificaciones.appendChild(successMessage);
            // Opcional: limpiar el formulario
            // formNotificaciones.reset();
        }
    }

    function validarInputNotificaciones(input) {
        const value = input.value.trim();
        const errorDiv = document.getElementById(`${input.id}-error`);

        if (!value) {
            errorDiv.textContent = 'Este campo es obligatorio.';
            errorDiv.style.display = 'block';
            return false;
        }

        if (input.id === 'asunto' && value.length > 100) {
            errorDiv.textContent = 'El asunto no puede exceder los 100 caracteres.';
            errorDiv.style.display = 'block';
            return false;
        } else if (input.id === 'descripcion' && value.length > 300) {
            errorDiv.textContent = 'La descripción no puede exceder los 300 caracteres.';
            errorDiv.style.display = 'block';
            return false;
        } else if (input.id === 'fecha') {
            const fechaSeleccionada = new Date(value);
            const hoy = new Date();

            // Asegurarse de que la fecha sea exactamente el día actual
            if (
                fechaSeleccionada.getFullYear() !== hoy.getFullYear() ||
                fechaSeleccionada.getMonth() !== hoy.getMonth() ||
                fechaSeleccionada.getDate() !== hoy.getDate()
            ) {
                errorDiv.textContent = 'La fecha debe ser el día actual.';
                errorDiv.style.display = 'block';
                return false;
            }
        }
        errorDiv.style.display = 'none';
        return true;
    }
}


  });

