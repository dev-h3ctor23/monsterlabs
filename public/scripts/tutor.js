/* tutor.js */

// Cargar el componente sidebar
fetch('/monsterlabs/components/sidebar-tutor.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('sidebar-component').innerHTML = data;
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

// Galería de imágenes
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

  // Cambio automático
  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    updateGallery();
  }, 5000);
});

// Sección de perfil: editar información del usuario
document.getElementById('btnEditar').addEventListener('click', function () {
  document.getElementById('infoUsuario').style.display = 'none';
  document.getElementById('formularioUsuario').style.display = 'block';

  document.getElementById('inputUsuario').value = document.getElementById('usuario').textContent;
  document.getElementById('inputNombre').value = document.getElementById('nombre').textContent;
  document.getElementById('inputApellidos').value = document.getElementById('apellidos').textContent;
  document.getElementById('inputDni').value = document.getElementById('dni').textContent;

});

// Validación para el responsable adicional-NO ELIMINAR
document.getElementById("responsable-adicional").addEventListener("change", function() {
  const responsableInfo = document.getElementById("responsable-info");
  if (this.value === "si") {
    responsableInfo.classList.remove("hidden");
  } else {
    responsableInfo.classList.add("hidden");
  }
});


// Envío del formulario de inscripción al campamento
document.addEventListener("DOMContentLoaded", function () {
  
   const formInscripcion = document.getElementById("form-inscripcion");
   const checkContainer = document.getElementById("check-container");
   const periodoRadios = document.querySelectorAll("input[name='periodo']");
 
   // Datos para cada opción
   const datosSemanal = [
     // Junio 2025
     { label: "1ª semana de Junio", start: "2025-06-02", end: "2025-06-06" },
     { label: "2ª semana de Junio", start: "2025-06-09", end: "2025-06-13" },
     { label: "3ª semana de Junio", start: "2025-06-16", end: "2025-06-20" },
     { label: "4ª semana de Junio", start: "2025-06-23", end: "2025-06-27" },
     // Julio 2025
     { label: "1ª semana de Julio", start: "2025-07-07", end: "2025-07-11" },
     { label: "2ª semana de Julio", start: "2025-07-14", end: "2025-07-18" },
     { label: "3ª semana de Julio", start: "2025-07-21", end: "2025-07-25" },
     { label: "4ª semana de Julio", start: "2025-07-28", end: "2025-08-01" },
     // Agosto 2025
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
 
   // Función para renderizar los checkbox según la opción
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
 
         const label = document.createElement("label");
         label.htmlFor = checkbox.id;
         label.textContent = dato.label;
 
         const wrapper = document.createElement("div");
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
 
         const label = document.createElement("label");
         label.htmlFor = checkbox.id;
         label.textContent = dato.label;
 
         const wrapper = document.createElement("div");
         wrapper.appendChild(checkbox);
         wrapper.appendChild(label);
         checkContainer.appendChild(wrapper);
       });
     } else if (tipo === "trimestral") {
       // Para trimestral no se muestran checkbox
       checkContainer.innerHTML = "<p>Se seleccionó período trimestral: del 1 de Junio al 31 de Agosto de 2025.</p>";
     }
   }
 
   // Actualizar checkbox al cambiar la opción de período
   periodoRadios.forEach(radio => {
     radio.addEventListener("change", function () {
       renderCheckboxes(this.value);
     });
   });
 
   // Función que devuelve un array con los períodos seleccionados
   function obtenerPeriodosSeleccionados(tipo) {
     let periodos = [];
     if (tipo === "trimestral") {
       periodos.push({ fechaInicio: "2025-06-01", fechaFin: "2025-08-31" });
     } else {
       const checkboxes = Array.from(checkContainer.querySelectorAll("input[type='checkbox']:checked"));
       if (checkboxes.length === 0) {
         alert("Seleccione al menos una opción para calcular las fechas.");
         return null;
       }
       if (tipo === "semanal") {
         // Cada checkbox es un período independiente
         checkboxes.forEach(chk => {
           periodos.push({
             fechaInicio: chk.getAttribute("data-start"),
             fechaFin: chk.getAttribute("data-end")
           });
         });
       } else if (tipo === "mensual") {
         // Para mensual se pueden combinar períodos contiguos.
         // Se extrae la información junto con el índice (suponiendo que el id contiene el índice final)
         let seleccionados = checkboxes.map(chk => ({
           start: chk.getAttribute("data-start"),
           end: chk.getAttribute("data-end"),
           index: parseInt(chk.id.split('-').pop())
         }));
         // Ordenar por índice
         seleccionados.sort((a, b) => a.index - b.index);
         // Combinar períodos contiguos
         let grupoInicio = seleccionados[0].start;
         let grupoFin = seleccionados[0].end;
         for (let i = 1; i < seleccionados.length; i++) {
           if (seleccionados[i].index === seleccionados[i - 1].index + 1) {
             // Si son contiguos, actualizamos la fecha de fin
             grupoFin = seleccionados[i].end;
           } else {
             // Si no son contiguos, guardamos el grupo anterior y reiniciamos
             periodos.push({ fechaInicio: grupoInicio, fechaFin: grupoFin });
             grupoInicio = seleccionados[i].start;
             grupoFin = seleccionados[i].end;
           }
         }
         // Agregar el último grupo
         periodos.push({ fechaInicio: grupoInicio, fechaFin: grupoFin });
       }
     }
     return periodos;
   }
 
   formInscripcion.addEventListener("submit", function (event) {
     event.preventDefault();
     console.log("Formulario enviado, pero la página no se recargará.");
 
     // Determinar la opción seleccionada
     const periodoSeleccionado = document.querySelector("input[name='periodo']:checked");
     if (!periodoSeleccionado) {
       alert("Seleccione un período.");
       return;
     }
     const tipoPeriodo = periodoSeleccionado.value;
     const periodosSeleccionados = obtenerPeriodosSeleccionados(tipoPeriodo);
     if (!periodosSeleccionados) return; // si no hay selección
 
     const formData = {
       nombre: document.getElementById("nombre-nino").value,
       apellidos: document.getElementById("apellidos-nino").value,
       fechaNacimiento: document.getElementById("fecha-nacimiento").value,
       periodo: tipoPeriodo,
       // Se envía el array de períodos (cada uno con fechaInicio y fechaFin)
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

    console.log("Datos de inscripción recibidos:", formData);

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
        //formInscripcion.reset();
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

// Manejo del registro del padre (solo si el usuario aún no está registrado como padre)
document.addEventListener("DOMContentLoaded", function() {

  function renderChildEditForms(ninos) {
    // Guardar la plantilla antes de limpiar el contenedor
    const childTemplate = document.getElementById('hijoModelo');
    if (!childTemplate) {
      console.error("No se encontró la plantilla de hijo.");
      return;
    }
    const templateHTML = childTemplate.outerHTML; // Guardar la plantilla como HTML

    const hijosContainer = document.getElementById('hijos');
    hijosContainer.innerHTML = ''; // Limpiar contenido previo

    ninos.forEach(nino => {
      // Crear un contenedor temporal para generar el clon
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = templateHTML;
      const childClone = tempDiv.firstElementChild;
      childClone.style.display = 'block';
      childClone.classList.remove('modelo');
      
      // Completar datos actuales
      childClone.querySelector('.nombre').textContent = nino.nombre;
      childClone.querySelector('.apellidos').textContent = nino.apellido;
      childClone.querySelector('.fecha').textContent = nino.fecha_nacimiento;

      
      // Pre-cargar valores en el formulario de edición
      childClone.querySelector('.inputNombre').value = nino.nombre;
      childClone.querySelector('.inputApellidos').value = nino.apellido;
      childClone.querySelector('.inputFecha').value = nino.fecha_nacimiento;
     
      
      // Agregar event listener para mostrar/ocultar el formulario de edición
      const editButton = childClone.querySelector('.btnEditar');
      const saveButton = childClone.querySelector('.btnGuardar');
      const form = childClone.querySelector('.formulario');
      editButton.addEventListener('click', function() {
         form.style.display = form.style.display === 'none' ? 'block' : 'none';
      });
      
      // Event listener para guardar la información editada
      saveButton.addEventListener('click', function() {
         const updatedChild = {
             id_nino: nino.id_nino, // Se asume que el objeto nino incluye el id
             nombre: childClone.querySelector('.inputNombre').value,
             apellido: childClone.querySelector('.inputApellidos').value,
             fecha_nacimiento: childClone.querySelector('.inputFecha').value,
             action: 'updateChild'
         };
         console.log("Datos actualizados del hijo:", updatedChild);
         fetch("/monsterlabs/mvc/controllers/tutor.php", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify(updatedChild)
         })
         .then(response => response.json())
         .then(result => {
             if(result.status === "success"){
              console.log("Información del hijo actualizada correctamente");
                 // Actualizar la vista con los nuevos datos
                 childClone.querySelector('.nombre').textContent = updatedChild.nombre;
                 childClone.querySelector('.apellidos').textContent = updatedChild.apellido;
                 childClone.querySelector('.fecha').textContent = updatedChild.fecha_nacimiento;
                 form.style.display = 'none';
             } else {
              console.log("Error al actualizar: " + result.message);
             }
         })
         .catch(error => {
             console.error("Error:", error);
         });
      });
      
              // Botón para eliminar el hijo
        const deleteButton = childClone.querySelector('.btnEliminar');
        deleteButton.addEventListener('click', function() {
            if (confirm("¿Estás seguro de eliminar este hijo?")) {
                const deleteData = {
                    id_nino: nino.id_nino,
                    action: "deleteChild"
                };
                console.log("Data enviada para eliminar: " + deleteData.id_nino)
                fetch("/monsterlabs/mvc/controllers/tutor.php", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(deleteData)
                })
                .then(response => response.json())
                .then(result => {
                    if (result.status === "success") {   
                      console.log(result.message);
                          // Eliminar el elemento del DOM
                          childClone.remove();
                    } else {
                      console.log("Error: " + result.message);
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    console.log("Ocurrió un error al eliminar el hijo");
                });
            }
        });


      hijosContainer.appendChild(childClone);
    });
  }

  fetch('/monsterlabs/mvc/controllers/tutor.php')
    .then(response => response.json())
    .then(data => {
      console.log(data)
      // Si el usuario ya tiene datos de padre, se oculta el modal
      if (data.status === "success" && data.padre) {
        console.log("data.status === success && data.padre");
        document.getElementById("modal-overlay").style.display = "none";
        document.getElementById("usuario").textContent   = data.usuario.username;
        document.getElementById("nombre").textContent    = data.padre.nombre;
        document.getElementById("apellidos").textContent = data.padre.apellido;
        document.getElementById("dni").textContent       = data.padre.dni;
        document.getElementById("telefono").textContent  = data.padre.telefono;

        // Actualizar sección de hijos
        const infoHijos = document.getElementById("infoHijos");
        infoHijos.innerHTML = ''; // Limpiar contenido previo
        console.log(data.ninos);
        if (data.ninos && data.ninos.length > 0) {
          data.ninos.forEach(nino => {
            const childDiv = document.createElement("div");
            childDiv.classList.add("child-info");
            childDiv.innerHTML = `
              <p><strong>Nombre:</strong> ${nino.nombre}</p>
              <p><strong>Apellidos:</strong> ${nino.apellido}</p>
              <p><strong>Fecha de nacimiento:</strong> ${nino.fecha_nacimiento}</p>
              <p><strong>===============================</strong></p>
            `;
            infoHijos.appendChild(childDiv);
          });
          renderChildEditForms(data.ninos);
        } else {
          infoHijos.innerHTML = "<p>No hay hijos registrados.</p>";
        }
        // Asumiendo que 'data.ninos' ya contiene el array de hijos con id_grupo
        if (data.ninos && data.ninos.length > 0) {
          const childCalendarsDiv = document.getElementById('childCalendars');
          
          data.ninos.forEach(nino => {
            // Crear un contenedor para cada hijo
            const calendarContainer = document.createElement('div');
            calendarContainer.classList.add('child-calendar');
            
            // Agregar título con el nombre del hijo
            const title = document.createElement('h3');
            title.textContent = `${nino.nombre} ${nino.apellido}`;
            calendarContainer.appendChild(title);
            
            // Crear div donde se inyectará el calendario
            const calendarDiv = document.createElement('div');
            calendarDiv.id = 'calendar-' + nino.id_nino;
            calendarDiv.classList.add('calendar');
            calendarContainer.appendChild(calendarDiv);
            
            // Añadir el contenedor al div principal de calendarios
            childCalendarsDiv.appendChild(calendarContainer);
            
            // Inicializar FullCalendar (requiere jQuery)
            $('#' + calendarDiv.id).fullCalendar({
              locale: 'es',
              header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
              },
              // Ahora se consulta el endpoint enviando el id del niño
              events: '/monsterlabs/mvc/controllers/cronograma.php?ninoId=' + nino.id_nino,
              editable: false,
              eventLimit: true
            });
          });
        }
        

      } else {
        // Si no está registrado como padre, se muestra el modal y se asigna el evento al formulario
        document.getElementById("modal-overlay").style.display = "block";
        const formInscripcionPadre = document.getElementById("form-inscripcion-padre");
        formInscripcionPadre.addEventListener("submit", function(e) {
          e.preventDefault();
          var nombre = document.getElementById("nombre-padre").value.trim();
          var apellidos = document.getElementById("apellidos-padre").value.trim();
          var dni = document.getElementById("dni-padre").value.trim();
          var telefono = document.getElementById("telefono-padre").value.trim();
          if (nombre && apellidos && dni && telefono) {
            console.log("Enviando datos formulario...")
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

// Cambio a la sección de edición de hijos
document.getElementById('btnEditarHijos').addEventListener('click', function () {
  document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
  document.getElementById('section-editar-datos').classList.add('active');
});


