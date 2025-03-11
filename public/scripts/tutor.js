/* tutor.js */

// ---------------------CODIGO PARA CUANDO SE VUELE ATRAS AL CERRAR SESION-----------------------º
// Empuja un estado al historial
window.history.pushState(null, null, window.location.href);

// Listener para el evento popstate (cuando se presiona "atrás")
window.addEventListener('popstate', function (event) {
  window.location.replace("../../mvc/views/log-in.html");
});

// Listener para el evento pageshow (para detectar carga desde la cache)
window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    window.location.replace("../../mvc/views/log-in.html");
  }
});



// Cargar el componente sidebar
fetch('../../components/sidebar-tutor.html')
  .then(response => response.text())
  .then(dataSidebar => {
    document.getElementById('sidebar-component').innerHTML = dataSidebar;
    // Cargar script del sidebar
    const script = document.createElement('script');
    script.src = '../../public/scripts/script-sidebar.js';
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
    fetch("../../mvc/controllers/tutor.php", {
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


// Función para abrir el modal y rellenar sus campos con los datos actuales
function abrirModalEdicion(childId, row) {
  // Extraer los datos básicos del niño desde las celdas de la fila
  const nombre = row.querySelector('td[data-field="nombre"]').textContent.trim();
  const apellido = row.querySelector('td[data-field="apellido"]').textContent.trim();
  const fechaNacimiento = row.querySelector('td[data-field="fecha_nacimiento"]').textContent.trim();
  
  // Rellenar los inputs con los datos básicos
  document.getElementById('input-nombre-hijo').value = nombre;
  document.getElementById('input-apellidos-hijo').value = apellido;
  document.getElementById('input-fecha-nacimiento').value = fechaNacimiento;
  
  // Rellenar los inputs adicionales usando atributos data-*
  document.getElementById('input-alergia-alimentos').value = row.dataset.alergiaAlimentos || '';
  document.getElementById('input-alergia-medicamentos').value = row.dataset.alergiaMedicamentos || '';
  document.getElementById('input-medicamento-actual').value = row.dataset.medicamentoActual || '';
  
  // Rellenar los campos del guardian
  document.getElementById('input-dni-guardian').value = row.dataset.dniGuardian || '';
  document.getElementById('input-nombre-guardian').value = row.dataset.nombreGuardian || '';
  document.getElementById('input-apellidos-guardian').value = row.dataset.apellidosGuardian || '';
  document.getElementById('input-telefono-guardian').value = row.dataset.telefonoGuardian || '';
  document.getElementById('input-relacion-guardian').value = row.dataset.relacionGuardian || '';
  
  // Configurar el select y la sección del guardian según si existe información
  if (row.dataset.dniGuardian && row.dataset.dniGuardian.trim() !== "") {
    // Existe guardian: el select se establece en "si" y se muestra la sección
    document.getElementById('select-responsable-editar').value = 'si';
    document.getElementById('guardian-section').classList.remove('hidden');
  } else {
    // No existe guardian: el select se establece en "no" y se oculta la sección
    document.getElementById('select-responsable-editar').value = 'no';
    document.getElementById('guardian-section').classList.add('hidden');
  }
  
  // Guardar el ID del niño en un campo oculto
  document.getElementById('input-id-hijo').value = childId;
  
  // Mostrar el modal
  document.getElementById('modal-edit-hijo').style.display = 'flex';
}


// Manejo de eventos al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
  // Delegar evento de clic en los botones "Editar" de la tabla
  const hijosTableBody = document.querySelector("#infoHijos tbody");
  if (hijosTableBody) {
    hijosTableBody.addEventListener('click', function(e) {
      const target = e.target;
      if (target.classList.contains('btnEditarHijo')) {
        e.preventDefault();
        const row = target.closest('tr[data-child-id]');
        if (!row) return;
        const childId = row.getAttribute('data-child-id');
        abrirModalEdicion(childId, row);
      }
    });
  }
  
  // Cerrar el modal al hacer clic en la cruz
  document.getElementById('btn-cerrar-modal').addEventListener('click', function() {
    document.getElementById('modal-edit-hijo').style.display = 'none';
  });
  

  // Cerrar el modal al hacer clic en el botón "Cancelar"
  document.getElementById('btn-cancelar-edit').addEventListener('click', function() {
    document.getElementById('modal-edit-hijo').style.display = 'none';
  });
  
  // Manejar el envío del formulario del modal
  document.getElementById('form-editar-hijo').addEventListener('submit', function(e) {
    e.preventDefault();
  
    // Tomamos el valor del select para determinar si se requiere guardian
    const responsableAdicional = document.getElementById('select-responsable-editar').value;
  
    // Construimos el objeto de datos a enviar
    const data = {
      action: 'updateChildFull',
      id_nino: document.getElementById('input-id-hijo').value,
      nombre: document.getElementById('input-nombre-hijo').value,
      apellido: document.getElementById('input-apellidos-hijo').value,
      fecha_nacimiento: document.getElementById('input-fecha-nacimiento').value,
      alimentos_alergico: document.getElementById('input-alergia-alimentos').value,
      medicamentos_alergico: document.getElementById('input-alergia-medicamentos').value,
      medicamentos_actuales: document.getElementById('input-medicamento-actual').value,
      responsableAdicional: responsableAdicional
    };
  
    // Si se requiere guardian, incluimos sus datos; de lo contrario, se envían como vacíos
    if (responsableAdicional === "si") {
      data.dni_guardian       = document.getElementById('input-dni-guardian').value;
      data.guardian_nombre    = document.getElementById('input-nombre-guardian').value;
      data.guardian_apellido  = document.getElementById('input-apellidos-guardian').value;
      data.telefono_guardian  = document.getElementById('input-telefono-guardian').value;
      data.relacion_guardian  = document.getElementById('input-relacion-guardian').value;
    } else {
      data.dni_guardian       = "";
      data.guardian_nombre    = "";
      data.guardian_apellido  = "";
      data.telefono_guardian  = "";
      data.relacion_guardian  = "";
    }
  
    console.log("Submitting data:", data);
  
    // Envío de la solicitud AJAX a tutor.php
    fetch('../../mvc/controllers/tutor.php', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      if (result.status === "success") {
        // Actualizar la fila de la tabla con los nuevos datos
        const row = document.querySelector(`tr[data-child-id="${data.id_nino}"]`);
        if (row) {
          row.querySelector('td[data-field="nombre"]').textContent = data.nombre;
          row.querySelector('td[data-field="apellido"]').textContent = data.apellido;
          row.querySelector('td[data-field="fecha_nacimiento"]').textContent = data.fecha_nacimiento;
          row.dataset.alergiaAlimentos = data.alimentos_alergico;
          row.dataset.alergiaMedicamentos = data.medicamentos_alergico;
          row.dataset.medicamentoActual = data.medicamentos_actuales;
          row.dataset.dniGuardian = data.dni_guardian;
          row.dataset.nombreGuardian = data.guardian_nombre;
          row.dataset.apellidosGuardian = data.guardian_apellido;
          row.dataset.telefonoGuardian = data.telefono_guardian;
          row.dataset.relacionGuardian = data.relacion_guardian;
  
          // Actualizar la fila de detalle (la que muestra ficha médica y guardian)
          const detailRow = row.nextElementSibling;
          if (detailRow && detailRow.classList.contains('detail-row')) {
            detailRow.innerHTML = `
              <td colspan="4">
                <div class="detail-container">
                  <div class="ficha-medica">
                    <strong>Ficha Médica:</strong>
                    <table class="subtable">
                      <tbody>
                        <tr>
                          <td>Alimentos:</td>
                          <td data-field="alimento-alergico">${data.alimentos_alergico || 'NO TIENE'}</td>
                        </tr>
                        <tr>
                          <td>Medicamentos alérgicos:</td>
                          <td data-field="medicamento-alergico">${data.medicamentos_alergico || 'NO TIENE'}</td>
                        </tr>
                        <tr>
                          <td>Medicamentos actuales:</td>
                          <td data-field="medicamento-actual">${data.medicamentos_actuales || 'NO TIENE'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="guardian">
                    <strong>Guardian:</strong>
                    <table class="subtable">
                      <tbody>
                        <tr>
                          <td>DNI:</td>
                          <td>${data.dni_guardian || 'NO TIENE'}</td>
                        </tr>
                        <tr>
                          <td>Nombre:</td>
                          <td>${data.guardian_nombre || 'NO TIENE'}</td>
                        </tr>
                        <tr>
                          <td>Apellido:</td>
                          <td>${data.guardian_apellido || 'NO TIENE'}</td>
                        </tr>
                        <tr>
                          <td>Teléfono:</td>
                          <td>${data.telefono_guardian || 'NO TIENE'}</td>
                        </tr>
                        <tr>
                          <td>Relación:</td>
                          <td>${data.relacion_guardian || 'NO TIENE'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </td>
            `;
          }
        }
        // Ocultar el modal
        document.getElementById('modal-edit-hijo').style.display = 'none';
        

      } else {
        console.error("Error al actualizar: " + result.message);
      }
    })
    .catch(error => console.error("Error en la solicitud:", error));
  });  
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
  
    fetch('../../mvc/controllers/tutor.php', {
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
  
    fetch("../../mvc/controllers/tutor.php", {
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
  fetch('../../mvc/controllers/tutor.php')
    .then(response => response.json())
    .then(data => {
      console.log(data);

      if (data.status === "error") {
        window.location.replace("../../mvc/views/log-in.html");
      } else if (data.status === "success" && data.padre) {
        console.log("data.status === success && data.padre");
        // Guardar globalmente la data para usar en la edición de hijos
        window.tutorData = data;
        

        //Se rellena los datos del padre
        document.getElementById("modal-overlay").style.display = "none";
        document.getElementById("usuario").textContent   = data.usuario.username;
        document.getElementById("nombre").textContent    = data.padre.nombre;
        document.getElementById("apellidos").textContent = data.padre.apellido;
        document.getElementById("dni").textContent       = data.padre.dni;
        document.getElementById("telefono").textContent  = data.padre.telefono;
        const profileImage = document.getElementById('profileImage');
            if (data.usuario.foto) {
                profileImage.src = data.usuario.foto;
            } else {
                profileImage.src = '../../assets/fotoUsuarios/defecto.png';
            }


        // Renderizado de la tabla de hijos (con celdas editables)
        const infoHijosTableBody = document.querySelector("#infoHijos tbody");
        infoHijosTableBody.innerHTML = "";
  
        if (data.ninos && data.ninos.length > 0) {
          data.ninos.forEach(nino => {
            // Fila principal
  const mainRow = document.createElement("tr");
  mainRow.setAttribute('data-child-id', nino.id_nino);
  mainRow.dataset.alergiaAlimentos = nino.ficha_medica ? nino.ficha_medica.alimentos_alergico : '';
  mainRow.dataset.alergiaMedicamentos = nino.ficha_medica ? nino.ficha_medica.medicamentos_alergico : '';
  mainRow.dataset.medicamentoActual = nino.ficha_medica ? nino.ficha_medica.medicamentos_actuales : '';
  mainRow.dataset.dniGuardian = nino.guardian ? nino.guardian.dni_guardian : '';
  mainRow.dataset.nombreGuardian = nino.guardian ? nino.guardian.nombre : '';
  mainRow.dataset.apellidosGuardian = nino.guardian ? nino.guardian.apellido : '';
  mainRow.dataset.telefonoGuardian = nino.guardian ? nino.guardian.telefono : '';
  mainRow.dataset.relacionGuardian = nino.guardian ? nino.guardian.relacion : '';
  mainRow.innerHTML = `
    <td data-field="nombre">${nino.nombre}</td>
    <td data-field="apellido">${nino.apellido}</td>
    <td data-field="fecha_nacimiento">${nino.fecha_nacimiento}</td>
    <td>
      <button class="btnEditarHijo">Editar</button>
      <button class="btnEliminarHijo">Eliminar</button>
    </td>
  `;
  infoHijosTableBody.appendChild(mainRow);
  
      // Fila detalle: Ficha Médica y Guardian
      const detailRow = document.createElement("tr");
      detailRow.classList.add("detail-row"); // Para aplicar estilos o comportamiento extra
      detailRow.innerHTML = `
      <td colspan="4">
        <div class="detail-container">
          <div class="ficha-medica">
            <strong>Ficha Médica:</strong>
            ${ nino.ficha_medica 
              ? `<table class="subtable">
                    <tr>
                      <td>Alimentos:</td>
                      <td data-field="alimento-alergico">${ nino.ficha_medica.alimentos_alergico || 'NO TIENE' }</td>
                    </tr>
                    <tr>
                      <td>Medicamentos alérgicos:</td>
                      <td data-field="medicamento-alergico">${ nino.ficha_medica.medicamentos_alergico || 'NO TIENE' }</td>
                    </tr>
                    <tr>
                      <td>Medicamentos actuales:</td>
                      <td data-field="medicamento-actual">${ nino.ficha_medica.medicamentos_actuales || 'NO TIENE' }</td>
                    </tr>
                  </table>`
              : '<p>No existe Ficha Médica</p>' }
          </div>
          <div class="guardian">
            <strong>Guardian:</strong>
            ${ nino.guardian 
              ? `<table class="subtable">
                    <tr>
                      <td>DNI:</td>
                      <td>${ nino.guardian.dni_guardian }</td>
                    </tr>
                    <tr>
                      <td>Nombre:</td>
                      <td>${ nino.guardian.nombre }</td>
                    </tr>
                    <tr>
                      <td>Apellido:</td>
                      <td>${ nino.guardian.apellido }</td>
                    </tr>
                    <tr>
                      <td>Teléfono:</td>
                      <td>${ nino.guardian.telefono || 'NO TIENE' }</td>
                    </tr>
                    <tr>
                      <td>Relacion:</td>
                      <td>${ nino.guardian.relacion || 'NO TIENE' }</td>
                    </tr>
                  </table>`
              : '<p>No existe Guardian</p>' }
          </div>
        </div>
      </td>
    `;
    
      infoHijosTableBody.appendChild(detailRow);
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
              events: '../../mvc/controllers/cronograma.php?ninoId=' + nino.id_nino,
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
  
        //Editar información del padre
        document.getElementById('btnEditar').addEventListener('click', function () {
          document.getElementById('infoUsuario').style.display = 'none';
          document.getElementById('formularioUsuario').style.display = 'block';
          document.getElementById('formularioEditarUsario').style.display = 'block';
          document.getElementById('profile-card-children').style.display = 'none';

          
          document.getElementById('inputNombrePadre').value       = document.getElementById('nombre').textContent;
          document.getElementById('inputApellidosPadre').value    = document.getElementById('apellidos').textContent;
          document.getElementById('inputDniPadre').value          = document.getElementById('dni').textContent;
          document.getElementById('inputTelefonoPadre').value     = document.getElementById('telefono').textContent;
        });
        
        document.getElementById ("btn-volver-perfil").addEventListener("click", function () {
          document.getElementById('formularioEditarUsario').style.display = 'none';
          document.getElementById('formularioUsuario').style.display = 'none';
          document.getElementById('infoUsuario').style.display = 'block';
          document.getElementById('profile-card-children').style.display = 'block';
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
          fetch('../../mvc/controllers/tutor.php', {
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
                document.getElementById('formularioUsuario').style.display = 'none';
                document.getElementById('infoUsuario').style.display = 'block';
                document.getElementById('profile-card-children').style.display = 'block';
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
            fetch('../../mvc/controllers/tutor.php', {
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
      // En caso de error, puedes redirigir al log-in o mostrar el modal
      window.location.replace("../../mvc/views/log-in.html");
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




//-----------------------ACTUALIZAR FOTO ------------------------
document.addEventListener('DOMContentLoaded', function() {

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

            fetch('../../mvc/controllers/cambiar-foto-tutor.php', {
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

    

});


// --------------------------CERRAR SESION----------------------------
document.addEventListener("click", function (event) {
  // Detectar si se hizo clic en el botón de salir
  let logoutBtn = event.target.closest("#logoutBtn");
  if (logoutBtn) {
      event.preventDefault();

      fetch("../../mvc/controllers/logout.php")
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



// --- Mostrar/Ocultar la sección del guardian en el modal de edición ---
document.getElementById('select-responsable-editar').addEventListener('change', function() {
  const guardianSection = document.getElementById('guardian-section');
  if (this.value === 'si') {
    guardianSection.classList.remove('hidden');
  } else {
    guardianSection.classList.add('hidden');
    // Opcional: limpiar los campos del guardian
    guardianSection.querySelectorAll('input').forEach(input => input.value = '');
  }
});



