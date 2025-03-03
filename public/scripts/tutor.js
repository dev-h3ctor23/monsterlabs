/* tutor.js */

// ---------------------CODIGO PARA CUANDO SE VUELE ATRAS AL CERRAR SESION-----------------------º
// Empuja un estado al historial
window.history.pushState(null, null, window.location.href);

// Listener para el evento popstate (cuando se presiona "atrás")
window.addEventListener('popstate', function (event) {
  window.location.replace("/monsterlabs/mvc/views/log-in.html");
});

// Listener para el evento pageshow (para detectar carga desde la cache)
window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    window.location.replace("/monsterlabs/mvc/views/log-in.html");
  }
});



// Cargar el componente sidebar
fetch('/monsterlabs/components/sidebar-tutor.html')
  .then(response => response.text())
  .then(dataSidebar => {
    document.getElementById('sidebar-component').innerHTML = dataSidebar;
    // Cargar script del sidebar
    const script = document.createElement('script');
    script.src = '/monsterlabs/public/scripts/script-sidebar.js';
    document.body.appendChild(script);

    const menuLinks = document.querySelectorAll(".sidebar .nav-link[data-section]");
    const sections = document.querySelectorAll(".section");

    // Navegación entre secciones
    menuLinks.forEach(link => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        sections.forEach(section => section.classList.remove("active"));
        const sectionId = link.getAttribute("data-section");
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
          activeSection.classList.add("active");
        }
      });
    });
  })
  .catch(error => console.error('Error al cargar el componente:', error));


  


// Función para eliminar un hijo
function deleteChild(childId) {
  if (confirm("¿Estás seguro de eliminar este hijo?")) {
    const deleteData = {
      id_nino: childId,
      action: "deleteChild"
    };
    fetch("/monsterlabs/mvc/controllers/tutor.php", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(deleteData)
    })
    .then(response => response.json())
    .then(result => {
      if (result.status === "success") {   
        console.log(result.message);
        // Elimina la fila de la tabla
        const row = document.querySelector(`tr[data-child-id="${childId}"]`);
        if (row) row.remove();
      } else {
        console.log("Error: " + result.message);
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }
}

// Delegación de eventos para la edición y eliminación inline de hijos
document.addEventListener('DOMContentLoaded', function() {
  // Asignar listener al <tbody> de la tabla de hijos
  const hijosTableBody = document.querySelector("#infoHijos tbody");
  if (hijosTableBody) {
    hijosTableBody.addEventListener('click', function(e) {
      const target = e.target;
      const row = target.closest('tr');
      if (!row) return;
      const childId = row.getAttribute('data-child-id');

      // Acción: Eliminar hijo
      if (target.classList.contains('btnEliminarHijo')) {
        deleteChild(childId);
      }
      // Acción: Editar/Guardar hijo inline
      else if (target.classList.contains('btnEditarHijo')) {
        // Si la fila no está en modo edición, activar la edición inline
        if (!row.classList.contains('editing')) {
          row.classList.add('editing');
          // Reemplazar el contenido de cada celda editable por un input
          row.querySelectorAll('td[data-field]').forEach(cell => {
            const field = cell.getAttribute('data-field');
            const value = cell.textContent;
            cell.setAttribute('data-original', value);
            const input = document.createElement('input');
            input.type = (field === 'fecha_nacimiento' ? 'date' : 'text');
            input.value = value;
            cell.textContent = '';
            cell.appendChild(input);
          });
          // Cambiar el texto del botón a "Guardar"
          target.textContent = 'Guardar';
        } else {
          // En modo edición, recopilar los datos actualizados de la fila
          const updatedChild = {};
          row.querySelectorAll('td[data-field]').forEach(cell => {
            const field = cell.getAttribute('data-field');
            const input = cell.querySelector('input');
            updatedChild[field] = input.value;
          });
          updatedChild.id_nino = childId;
          updatedChild.action = 'updateChild';
          // Enviar la actualización al servidor
          fetch("/monsterlabs/mvc/controllers/tutor.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedChild)
          })
          .then(response => response.json())
          .then(result => {
            if(result.status === "success"){
              console.log("Información del hijo actualizada correctamente");
              // Actualizar la fila: reemplazar los inputs por texto con el nuevo valor
              row.querySelectorAll('td[data-field]').forEach(cell => {
                const input = cell.querySelector('input');
                cell.textContent = input.value;
              });
              row.classList.remove('editing');
              target.textContent = 'Editar';
            } else {
              console.log("Error al actualizar: " + result.message);
            }
          })
          .catch(error => {
            console.error("Error:", error);
          });
        }
      }
    });
  }
});


// Resto de funciones y manejo de eventos (galería, formularios, etc.)
document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.gallery-track');
  const images = track.querySelectorAll('.gallery-image');
  const prevButton = document.querySelector('.gallery-nav.prev');
  const nextButton = document.querySelector('.gallery-nav.next');
  let currentIndex = 0;
  
  function updateGallery() {
    track.style.transform = `translateX(-${currentIndex * 320}px)`;
  }
  
  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateGallery();
  });
  
  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateGallery();
  });
  
  // Cambio automático de la galería
  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    updateGallery();
  }, 5000);
  
  // Editar información del padre
  document.getElementById('btnEditar').addEventListener('click', function () {
    document.getElementById('infoUsuario').style.display = 'none';
    document.getElementById('formularioUsuario').style.display = 'block';
  
    document.getElementById('inputUsuario').value = document.getElementById('usuario').textContent;
    document.getElementById('inputNombrePadre').value = document.getElementById('nombre').textContent;
    document.getElementById('inputApellidosPadre').value = document.getElementById('apellidos').textContent;
    document.getElementById('inputDniPadre').value = document.getElementById('dni').textContent;
  });
  
  // Validación para el responsable adicional
  document.getElementById("responsable-adicional").addEventListener("change", function() {
    const responsableInfo = document.getElementById("responsable-info");
    if (this.value === "si") {
      responsableInfo.classList.remove("hidden");
    } else {
      responsableInfo.classList.add("hidden");
    }
  });
  
  // Manejo de notificaciones
  document.getElementById('form-notificaciones').addEventListener('submit', function(e) {
    e.preventDefault();
    const asunto = document.getElementById('asunto').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
  
    if (!asunto || !descripcion) {
        console.log("Complete todos los campos");
        return;
    }
  
    const notifData = { asunto, descripcion };
  
    fetch('/monsterlabs/mvc/controllers/tutor.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifData)
    })
    .then(response => response.json())
    .then(result => {
        if(result.status === 'success'){
            console.log(result.message);
            document.getElementById('modal-notificacion').style.display = 'block';
            document.getElementById('form-notificaciones').reset();
        } else {
            console.log('Error: ' + result.message);
        }
    })
    .catch(error => console.error('Error en la solicitud:', error));
  });
  
  // Envío del formulario de inscripción al campamento
  const formInscripcion = document.getElementById("form-inscripcion");
  const checkContainer = document.getElementById("check-container");
  const periodoRadios = document.querySelectorAll("input[name='periodo']");
  
  const datosSemanal = [
    { label: "1ª semana de Junio", start: "2025-06-02", end: "2025-06-06" },
    { label: "2ª semana de Junio", start: "2025-06-09", end: "2025-06-13" },
    { label: "3ª semana de Junio", start: "2025-06-16", end: "2025-06-20" },
    { label: "4ª semana de Junio", start: "2025-06-23", end: "2025-06-27" },
    { label: "1ª semana de Julio", start: "2025-07-07", end: "2025-07-11" },
    { label: "2ª semana de Julio", start: "2025-07-14", end: "2025-07-18" },
    { label: "3ª semana de Julio", start: "2025-07-21", end: "2025-07-25" },
    { label: "4ª semana de Julio", start: "2025-07-28", end: "2025-08-01" },
    { label: "1ª semana de Agosto", start: "2025-08-04", end: "2025-08-08" },
    { label: "2ª semana de Agosto", start: "2025-08-11", end: "2025-08-15" },
    { label: "3ª semana de Agosto", start: "2025-08-18", end: "2025-08-22" },
    { label: "4ª semana de Agosto", start: "2025-08-25", end: "2025-08-29" }
  ];
  const datosMensual = [
    { label: "Junio 2025", start: "2025-06-01", end: "2025-06-30" },
    { label: "Julio 2025", start: "2025-07-01", end: "2025-07-31" },
    { label: "Agosto 2025", start: "2025-08-01", end: "2025-08-31" }
  ];
  
  function renderCheckboxes(tipo) {
    checkContainer.innerHTML = "";
    
    if (tipo === "semanal") {
      datosSemanal.forEach((dato, index) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `chk-semanal-${index}`;
        checkbox.value = index;
        checkbox.setAttribute("data-start", dato.start);
        checkbox.setAttribute("data-end", dato.end);
        // Asignamos una clase para aplicar estilos
        checkbox.classList.add("custom-checkbox");
    
        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.textContent = dato.label;
        // Asignamos una clase para el label
        label.classList.add("custom-label");
    
        const wrapper = document.createElement("div");
        // Clase para el contenedor de cada opción
        wrapper.classList.add("custom-wrapper");
    
        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        checkContainer.appendChild(wrapper);
      });
    } else if (tipo === "mensual") {
      datosMensual.forEach((dato, index) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `chk-mensual-${index}`;
        checkbox.value = index;
        checkbox.setAttribute("data-start", dato.start);
        checkbox.setAttribute("data-end", dato.end);
        checkbox.classList.add("custom-checkbox");
    
        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.textContent = dato.label;
        label.classList.add("custom-label");
    
        const wrapper = document.createElement("div");
        wrapper.classList.add("custom-wrapper");
    
        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        checkContainer.appendChild(wrapper);
      });
    } else if (tipo === "trimestral") {
      checkContainer.innerHTML = "<p class='custom-message'>Se seleccionó período trimestral: del 1 de Junio al 31 de Agosto de 2025.</p>";
    }
  }
  
  
  periodoRadios.forEach(radio => {
    radio.addEventListener("change", function () {
      renderCheckboxes(this.value);
    });
  });
  
  function obtenerPeriodosSeleccionados(tipo) {
    let periodos = [];
    if (tipo === "trimestral") {
      periodos.push({ fechaInicio: "2025-06-01", fechaFin: "2025-08-31" });
    } else {
      const checkboxes = Array.from(checkContainer.querySelectorAll("input[type='checkbox']:checked"));
      if (checkboxes.length === 0) {
        console.log("Seleccione al menos una opción para calcular las fechas.");
        return null;
      }
      if (tipo === "semanal") {
        checkboxes.forEach(chk => {
          periodos.push({
            fechaInicio: chk.getAttribute("data-start"),
            fechaFin: chk.getAttribute("data-end")
          });
        });
      } else if (tipo === "mensual") {
        let seleccionados = checkboxes.map(chk => ({
          start: chk.getAttribute("data-start"),
          end: chk.getAttribute("data-end"),
          index: parseInt(chk.id.split('-').pop())
        }));
        seleccionados.sort((a, b) => a.index - b.index);
        let grupoInicio = seleccionados[0].start;
        let grupoFin = seleccionados[0].end;
        for (let i = 1; i < seleccionados.length; i++) {
          if (seleccionados[i].index === seleccionados[i - 1].index + 1) {
            grupoFin = seleccionados[i].end;
          } else {
            periodos.push({ fechaInicio: grupoInicio, fechaFin: grupoFin });
            grupoInicio = seleccionados[i].start;
            grupoFin = seleccionados[i].end;
          }
        }
        periodos.push({ fechaInicio: grupoInicio, fechaFin: grupoFin });
      }
    }
    return periodos;
  }
  
  formInscripcion.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Formulario enviado, pero la página no se recargará.");
    const periodoSeleccionado = document.querySelector("input[name='periodo']:checked");
    if (!periodoSeleccionado) {
      console.log("Seleccione un período.");
      return;
    }
    const tipoPeriodo = periodoSeleccionado.value;
    const periodosSeleccionados = obtenerPeriodosSeleccionados(tipoPeriodo);
    if (!periodosSeleccionados) return;
    const formData = {
      nombre: document.getElementById("nombre-nino").value,
      apellidos: document.getElementById("apellidos-nino").value,
      fechaNacimiento: document.getElementById("fecha-nacimiento").value,
      periodo: tipoPeriodo,
      periodos: periodosSeleccionados,
      formaPago: document.getElementById("forma-pago").value,
      alergiaAlimentos: document.getElementById("alergia-alimentos").value,
      alergiaMedicamentos: document.getElementById("alergia-medicamentos").value,
      medicamentoActual: document.getElementById("medicamento-actual").value,
      responsableAdicional: document.getElementById("responsable-adicional").value
    };
  
    console.log("Datos del formulario:", formData);
  
    if (formData.responsableAdicional === "si") {
      formData.nombreResponsable    = document.getElementById("nombre-responsable").value;
      formData.apellidosResponsable = document.getElementById("apellidos-responsable").value;
      formData.dniResponsable       = document.getElementById("dni-responsable").value;
      formData.telefonoResponsable  = document.getElementById("telefono-responsable").value;
      formData.relacionResponsable  = document.getElementById("relacion-responsable").value;
    }
  
    fetch("/monsterlabs/mvc/controllers/tutor.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(result => {
      console.log("Respuesta del servidor:", result);
      if (result.status === "success") {
        console.log(result.message);
      } else {
        console.log("Error: " + result.message);
      }
    })
    .catch(error => {
      console.error("Error en la solicitud:", error);
      console.log("Ocurrió un error al enviar los datos. Inténtalo de nuevo.");
    });
  });
});


// Manejo del registro del padre (si el usuario ya está registrado como padre)
document.addEventListener("DOMContentLoaded", function() {
  fetch('/monsterlabs/mvc/controllers/tutor.php')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.status === "success" && data.padre) {
        console.log("data.status === success && data.padre");
        // Guardar globalmente la data para usar en la edición de hijos
        window.tutorData = data;
  
        document.getElementById("modal-overlay").style.display = "none";
        document.getElementById("usuario").textContent   = data.usuario.username;
        document.getElementById("nombre").textContent    = data.padre.nombre;
        document.getElementById("apellidos").textContent = data.padre.apellido;
        document.getElementById("dni").textContent       = data.padre.dni;
        document.getElementById("telefono").textContent  = data.padre.telefono;
  
        // Renderizado de la tabla de hijos (con celdas editables)
        const infoHijosTableBody = document.querySelector("#infoHijos tbody");
        infoHijosTableBody.innerHTML = "";
  
        if (data.ninos && data.ninos.length > 0) {
          data.ninos.forEach(nino => {
            const tr = document.createElement("tr");
            tr.setAttribute('data-child-id', nino.id_nino);
            tr.innerHTML = `
              <td data-field="nombre">${nino.nombre}</td>
              <td data-field="apellido">${nino.apellido}</td>
              <td data-field="fecha_nacimiento">${nino.fecha_nacimiento}</td>
              <td>
                <button class="btnEditarHijo">Editar</button>
                <button class="btnEliminarHijo">Eliminar</button>
              </td>
            `;
            infoHijosTableBody.appendChild(tr);
          });
        } else {
          const tr = document.createElement("tr");
          tr.innerHTML = `<td colspan="4">No hay hijos registrados.</td>`;
          infoHijosTableBody.appendChild(tr);
        }
  
        // Renderizar calendarios para cada hijo
        if (data.ninos && data.ninos.length > 0) {
          const childCalendarsDiv = document.getElementById('childCalendars');
          childCalendarsDiv.innerHTML = "";
          data.ninos.forEach(nino => {
            const calendarContainer = document.createElement('div');
            calendarContainer.classList.add('child-calendar');
            const title = document.createElement('h3');
            title.textContent = `${nino.nombre} ${nino.apellido}`;
            calendarContainer.appendChild(title);
            const calendarDiv = document.createElement('div');
            calendarDiv.id = 'calendar-' + nino.id_nino;
            calendarDiv.classList.add('calendar');
            calendarContainer.appendChild(calendarDiv);
            childCalendarsDiv.appendChild(calendarContainer);
            // Inicializar fullCalendar para este hijo
            $('#' + calendarDiv.id).fullCalendar({
              locale: 'es',
              header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
              },
              events: '/monsterlabs/mvc/controllers/cronograma.php?ninoId=' + nino.id_nino,
              editable: false,
              eventLimit: true,
              eventClick: function(calEvent, jsEvent, view) {
               // Asigna la información del evento a los elementos del modal
                $('#modalTitle').text(event.title);
                $('#modalBody').html(event.description || 'Sin detalles adicionales');
                // Muestra el modal (asegúrate de que el id coincida)
                $('#modal-actividad-calendar').modal('show');
              },
              
              defaultDate: '2025-06-01',
              validRange: {
                start: '2025-06-01',
                end: '2025-09-01'
              }
            });
          });
        }
  
        // Editar información del padre
        document.getElementById('btnEditar').addEventListener('click', function () {
          document.getElementById('infoUsuario').style.display = 'none';
          document.getElementById('formularioUsuario').style.display = 'block';
  
          document.getElementById('inputUsuario').value         = document.getElementById('usuario').textContent;
          document.getElementById('inputNombrePadre').value       = document.getElementById('nombre').textContent;
          document.getElementById('inputApellidosPadre').value    = document.getElementById('apellidos').textContent;
          document.getElementById('inputDniPadre').value          = document.getElementById('dni').textContent;
          document.getElementById('inputTelefonoPadre').value     = document.getElementById('telefono').textContent;
        });
  
        // Enviar el formulario para actualizar el perfil del padre
        document.getElementById('formularioEditarUsario').addEventListener('submit', function (e) {
          e.preventDefault();
          const dataUpdate = {
            action: 'updateProfile',
            nombre: document.getElementById('inputNombrePadre').value,
            apellidos: document.getElementById('inputApellidosPadre').value,
            dni: document.getElementById('inputDniPadre').value,
            telefono: document.getElementById('inputTelefonoPadre').value
          };
          console.log("Enviando..", dataUpdate);
          fetch('/monsterlabs/mvc/controllers/tutor.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataUpdate)
          })
            .then(response => response.json())
            .then(result => {
              console.log(result.message);
              if (result.status === 'success') {
                document.getElementById('nombre').textContent   = dataUpdate.nombre;
                document.getElementById('apellidos').textContent= dataUpdate.apellidos;
                document.getElementById('dni').textContent      = dataUpdate.dni;
                document.getElementById('telefono').textContent = dataUpdate.telefono;
                document.getElementById('formularioEditarUsario').style.display = 'none';
                document.getElementById('infoUsuario').style.display = 'block';
              } else {
                console.error("Error al actualizar el perfil:", result.message);
                document.getElementById("form-error").textContent = result.message;
              }
            })
            .catch(error => console.error("Error en la petición:", error));
        });
      } else {
        // Si no está registrado como padre, mostrar modal y asignar listener al formulario de inscripción
        document.getElementById("modal-overlay").style.display = "block";
        const formInscripcionPadre = document.getElementById("form-inscripcion-padre");
        formInscripcionPadre.addEventListener("submit", function(e) {
          e.preventDefault();
          var nombre = document.getElementById("nombre-padre").value.trim();
          var apellidos = document.getElementById("apellidos-padre").value.trim();
          var dni = document.getElementById("dni-padre").value.trim();
          var telefono = document.getElementById("telefono-padre").value.trim();
          if (nombre && apellidos && dni && telefono) {
            console.log("Enviando datos formulario...");
            fetch('/monsterlabs/mvc/controllers/tutor.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                nombre: nombre,
                apellidos: apellidos,
                dni: dni,
                telefono: telefono
              })
            })
            .then(response => response.json())
            .then(result => {
              if(result.status === "success") {
                document.getElementById("modal-overlay").style.display = "none";
                console.log("Perfil actualizado correctamente");
              } else {
                console.log("Error: " + result.message);
              }
            })
            .catch(error => {
              console.error("Error al enviar el formulario:", error);
              console.log("Ocurrió un error al enviar los datos.");
            });
          } else {
            console.log("Por favor, complete todos los campos.");
          }
        });
      }
    })
    .catch(error => {
      console.error("Error al obtener los datos del usuario:", error);
      document.getElementById("modal-overlay").style.display = "block";
    });
});
  
  
// Función que asigna el listener a un botón "btn-volver"
function agregarEventoBtnVolver(btn) {
  btn.addEventListener('click', function() {
    const currentSection = this.closest('.section');
    if (currentSection) {
      currentSection.classList.remove('active');
    }
    document.getElementById('section-inicio').classList.add('active');
  });
}

// Observador de mutaciones para detectar la inserción de elementos "btn-volver"
const observer = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        // Asegurarnos de que el nodo es un elemento
        if (node.nodeType === 1) {
          // Si el nodo agregado es un botón con clase "btn-volver", asignarle el listener
          if (node.classList.contains('btn-volver')) {
            agregarEventoBtnVolver(node);
          }
          // Si el nodo contiene elementos con la clase "btn-volver" (por ejemplo, un contenedor)
          const btns = node.querySelectorAll('.btn-volver');
          btns.forEach((btn) => {
            agregarEventoBtnVolver(btn);
          });
        }
      });
    }
  });
});

// Configuración del observador: observa cambios en todo el documento
observer.observe(document.body, { childList: true, subtree: true });

// (Opcional) Si el botón ya existe en el DOM, asignarle el listener inicialmente
document.querySelectorAll('.btn-volver').forEach((btn) => {
  agregarEventoBtnVolver(btn);
});


document.getElementById("btn-agregar-hijo").addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Agregar hijo");
    // Remueve la clase 'active' de todas las secciones
    document.querySelectorAll(".section").forEach(section => section.classList.remove("active"));
    // Activa la sección inscripción
    document.getElementById("section-inscripcion").classList.add("active");
});