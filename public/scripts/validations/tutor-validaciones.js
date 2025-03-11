document.addEventListener('DOMContentLoaded', () => {
    // VALIDACIONES DE REGISTRO DEL PADRE
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
                input.addEventListener('input', () => validarInputPadre(input));
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

    // VALIDACIÓN DE LA SECCIÓN PERFIL
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
                input.addEventListener('input', () => validarInputPerfil(input));
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

    // VALIDACIÓN DEL FORMULARIO DE EDITAR USUARIO
    const formEditarUsuario = document.getElementById('formularioEditarUsario');
    if (formEditarUsuario) {
        const submitButton = formEditarUsuario.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        const inputsEditarUsuario = [
            'inputUsuario',
            'inputNombrePadre',
            'inputApellidosPadre',
            'inputDniPadre',
            'inputTelefonoPadre'
        ];
        const errorMessage = document.getElementById('form-error');

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

        formEditarUsuario.addEventListener('submit', function(event) {
            event.preventDefault();
            if (isFormValid()) {
                errorMessage.style.display = 'none';
            } else {
                errorMessage.textContent = 'Por favor, llene todos los campos correctamente';
                errorMessage.style.display = 'inline';
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 3000);
            }
        });

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

        function updateSubmitButtonStatus() {
            submitButton.disabled = !isFormValid();
        }
        
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

        const selectResponsable = document.getElementById('responsable-adicional');
        const responsableInfo = document.getElementById('responsable-info');
        selectResponsable.addEventListener('change', () => {
            if (selectResponsable.value === 'si') {
                responsableInfo.classList.remove('hidden');
            } else {
                responsableInfo.classList.add('hidden');
            }
        });

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
            inputsInscripcion.forEach(id => {
                const input = document.getElementById(id);
                if (input && !validarInputInscripcion(input)) {
                    isValid = false;
                }
            });
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
                if (fechaNacimiento > hoy) {
                    errorDiv.textContent = 'La fecha de nacimiento no puede ser futura.';
                    errorDiv.style.display = 'block';
                    return false;
                }
                let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
                const m = hoy.getMonth() - fechaNacimiento.getMonth();
                if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                    edad--;
                }
                if (edad < 6) {
                    errorDiv.textContent = 'El niño debe tener al menos 6 años de edad.';
                    errorDiv.style.display = 'block';
                    return false;
                }
                if (edad > 9) {
                    errorDiv.textContent = 'El niño no puede tener más de 9 años de edad.';
                    errorDiv.style.display = 'block';
                    return false;
                }
            } else if (input.id === 'fecha-inicio' || input.id === 'fecha-fin') {
                const fecha = new Date(value);
                const año = fecha.getFullYear();
                const fechaMinima = new Date(año, 5, 1);
                const fechaMaxima = new Date(año, 7, 31);
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

    // VALIDACIÓN DEL FORMULARIO DE NOTIFICACIONES
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
                input.addEventListener('input', () => validarInputNotificaciones(input));
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
            if (isValid) {
                const prevMessage = document.getElementById('success-message');
                if (prevMessage) {
                    prevMessage.remove();
                }
                const successMessage = document.createElement('div');
                successMessage.id = 'success-message';
                successMessage.textContent = 'Solicitud de contacto enviada exitosamente, el administrador lo contactará lo antes posible. Gracias.';
                successMessage.style.color = 'green';
                successMessage.style.fontSize = '14px';
                successMessage.style.marginTop = '10px';

                formNotificaciones.appendChild(successMessage);
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

    // ===============================
    // VALIDACIÓN DEL FORMULARIO DE EDITAR HIJO
    // ===============================

    const formEditarHijo = document.getElementById('form-editar-hijo');
    if (formEditarHijo) {
        // Deshabilitar el botón por defecto
        const submitButton = document.getElementById('btn-guardar-edit');
        submitButton.disabled = true;
        
        // Validación de campos principales del niño
        const inputsEditarHijo = ['input-nombre-hijo', 'input-apellidos-hijo', 'input-fecha-nacimiento'];
        inputsEditarHijo.forEach(id => {
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
                    validarInputEditarHijo(input);
                    updateSubmitButtonStatus();
                });
                input.addEventListener('input', () => {
                    validarInputEditarHijo(input);
                    updateSubmitButtonStatus();
                });
            }
        });
    
        // Validación de campos del guardian
        const guardianFields = [
            'input-dni-guardian',
            'input-nombre-guardian',
            'input-apellidos-guardian',
            'input-telefono-guardian',
            'input-relacion-guardian'
        ];
        guardianFields.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.dataset.touched = "false"; // Inicialmente no tocado
                const errorDiv = document.createElement('div');
                errorDiv.id = `${id}-error`;
                errorDiv.style.color = 'red';
                errorDiv.style.fontSize = '12px';
                errorDiv.style.marginTop = '5px';
                errorDiv.style.display = 'none';
                input.insertAdjacentElement('afterend', errorDiv);
    
                input.addEventListener('blur', () => {
                    input.dataset.touched = "true";
                    validarInputGuardian(input);
                    updateSubmitButtonStatus();
                });
                input.addEventListener('input', () => {
                    if (input.dataset.touched === "true") {
                        validarInputGuardian(input);
                    }
                    updateSubmitButtonStatus();
                });
            }
        });
    
        // Mostrar/ocultar sección del guardian según el select y actualizar botón
        const selectResponsableEditar = document.getElementById('select-responsable-editar');
        const guardianSection = document.getElementById('guardian-section');
        if (selectResponsableEditar && guardianSection) {
            selectResponsableEditar.addEventListener('change', () => {
                if (selectResponsableEditar.value === 'si') {
                    guardianSection.classList.remove('hidden');
                } else {
                    guardianSection.classList.add('hidden');
                }
                updateSubmitButtonStatus();
            });
        }
    
        // Función que valida todo el formulario de editar hijo
        function isFormValidEditarHijo() {
            let valid = true;
            // Validar campos principales
            inputsEditarHijo.forEach(id => {
                const input = document.getElementById(id);
                if (input && !validarInputEditarHijo(input)) {
                    valid = false;
                }
            });
            // Validar campos de ficha médica (opcional)
            const inputsFichaMedica = [
                'input-alergia-alimentos',
                'input-alergia-medicamentos',
                'input-medicamento-actual'
            ];
            inputsFichaMedica.forEach(id => {
                const input = document.getElementById(id);
                if (input && input.value.trim().length > 100) {
                    valid = false;
                }
            });
            // Validar campos del guardian si es requerido
            if (selectResponsableEditar.value === 'si') {
                guardianFields.forEach(id => {
                    const input = document.getElementById(id);
                    if (input && !validarInputGuardian(input)) {
                        valid = false;
                    }
                });
            }
            return valid;
        }
    
        const inputsFichaMedica = [
            'input-alergia-alimentos',
            'input-alergia-medicamentos',
            'input-medicamento-actual'
        ];
        inputsFichaMedica.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('blur', updateSubmitButtonStatus);
                input.addEventListener('input', updateSubmitButtonStatus);
            }
        });
    
        // Función para actualizar el estado del botón de submit
        function updateSubmitButtonStatus() {
            submitButton.disabled = !isFormValidEditarHijo();
        }
    
        // Evento submit del formulario de editar hijo
        formEditarHijo.addEventListener('submit', function(event) {
            event.preventDefault();
        
            // Si el guardian es requerido, mostramos la sección y forzamos la validación de cada campo
            if (selectResponsableEditar.value === 'si') {
                // Mostrar la sección del guardian
                guardianSection.classList.remove('hidden');
                // Forzar reflow para asegurar que la sección ya se muestra
                guardianSection.getBoundingClientRect();
        
                // Marcar cada campo del guardian como "touched" y llamar directamente a su validación
                guardianFields.forEach(id => {
                    const input = document.getElementById(id);
                    if (input) {
                        input.dataset.touched = "true";
                        validarInputGuardian(input);
                    }
                });
            }
        
            
                //if (isFormValidEditarHijo()) {
                    //formEditarHijo.submit();
               // }
            
        });
    
        // Función de validación de campos del hijo
        function validarInputEditarHijo(input) {
            const value = input.value.trim();
            const errorDiv = document.getElementById(`${input.id}-error`);
            const nombreApellidoRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;
    
            if (!value) {
                errorDiv.textContent = 'Este campo es obligatorio.';
                errorDiv.style.display = 'block';
                return false;
            }
    
            if ((input.id === 'input-nombre-hijo' || input.id === 'input-apellidos-hijo') && !nombreApellidoRegex.test(value)) {
                errorDiv.textContent = 'Este campo solo puede contener letras y espacios.';
                errorDiv.style.display = 'block';
                return false;
            }
    
            if (input.id === 'input-fecha-nacimiento') {
                const fechaNacimiento = new Date(value);
                const hoy = new Date();
                if (fechaNacimiento > hoy) {
                    errorDiv.textContent = 'La fecha de nacimiento no puede ser futura.';
                    errorDiv.style.display = 'block';
                    return false;
                }
                let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
                const m = hoy.getMonth() - fechaNacimiento.getMonth();
                if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                    edad--;
                }
                if (edad < 6) {
                    errorDiv.textContent = 'El niño debe tener al menos 6 años de edad.';
                    errorDiv.style.display = 'block';
                    return false;
                }
                if (edad > 9) {
                    errorDiv.textContent = 'El niño no puede tener más de 9 años de edad.';
                    errorDiv.style.display = 'block';
                    return false;
                }
            }
            errorDiv.style.display = 'none';
            return true;
        }
    
        // Función de validación modificada para los campos del guardian
        function validarInputGuardian(input) {
            const value = input.value.trim();
            const errorDiv = document.getElementById(`${input.id}-error`);
            const nombreApellidoRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;
            
            if (!value) {
                if (input.dataset.touched === "true") {
                    errorDiv.textContent = 'Este campo es obligatorio.';
                    errorDiv.style.display = 'block';
                }
                return false;
            }
            if (input.id === 'input-dni-guardian' && !/^[0-9]{8}[A-Za-z]$/.test(value)) {
                if (input.dataset.touched === "true") {
                    errorDiv.textContent = 'El DNI debe tener 8 dígitos seguidos de una letra (ej. 12345678A).';
                    errorDiv.style.display = 'block';
                }
                return false;
            }
            if ((input.id === 'input-nombre-guardian' ||
                 input.id === 'input-apellidos-guardian' ||
                 input.id === 'input-relacion-guardian') &&
                !nombreApellidoRegex.test(value)) {
                if (input.dataset.touched === "true") {
                    errorDiv.textContent = 'Este campo solo puede contener letras y espacios.';
                    errorDiv.style.display = 'block';
                }
                return false;
            }
            if (input.id === 'input-telefono-guardian' && !/^[0-9]{9}$/.test(value)) {
                if (input.dataset.touched === "true") {
                    errorDiv.textContent = 'El teléfono debe tener exactamente 9 dígitos.';
                    errorDiv.style.display = 'block';
                }
                return false;
            }
            errorDiv.style.display = 'none';
            return true;
        }
    }
    

    // Agregar más código sin salirse del DOM, IMPORTANTE!!!!!!!!!!
});
