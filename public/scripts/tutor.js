// Componente sidebar
fetch('/alpacode/monsterlabs/components/sidebar-tutor.html')
        .then(response => response.text())
        .then(data => {
        document.getElementById('sidebar-component').innerHTML = data;
        // Aqui se carga el script del sidebar de forma manual.
        const script = document.createElement('script');
        script.src = '/alpacode/monsterlabs/public/scripts/script-sidebar.js';
        document.body.appendChild(script);

        //DOM para actualizar al dar clic en las opciones del sidebar

        // Esperar a que el sidebar se haya insertado antes de buscar elementos
        //const menuBtn = document.getElementById("menuBtn");
        const sidebar = document.getElementById("sidebar-component");
        const content = document.getElementById("content");
        const menuLinks = document.querySelectorAll(".sidebar .nav-link[data-section]");
        const sections = document.querySelectorAll(".section");

        // if (!menuBtn) {
        //     console.error("ERROR: No se encontró el botón del menú después de cargar el sidebar.");
        //     return;
        // }

        // Evento para abrir/cerrar sidebar
        //menuBtn.addEventListener("click", function () {
          //  sidebar.classList.toggle("expanded");
            //document.body.classList.toggle("sidebar-expanded"); //
        //});

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
        })
        .catch(error => console.error('Error al cargar el componente:', error));

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
        
            // Cambio automatico
            setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                updateGallery();
            }, 5000); // Cambia cada 3 segundos
        });

    
        // sección de perfil

        document.getElementById('btnEditar').addEventListener('click', function () {
            document.getElementById('infoUsuario').style.display = 'none';
            document.getElementById('formularioUsuario').style.display = 'block';
        
            document.getElementById('inputUsuario').value = document.getElementById('usuario').textContent;
            document.getElementById('inputNombre').value = document.getElementById('nombre').textContent;
            document.getElementById('inputApellidos').value = document.getElementById('apellidos').textContent;
            document.getElementById('inputDni').value = document.getElementById('dni').textContent;
            document.getElementById('inputTelefono').value = document.getElementById('telefono').textContent;
        });
        
        document.getElementById('formulario').addEventListener('submit', function (event) {
            event.preventDefault();
        
            document.getElementById('usuario').textContent = document.getElementById('inputUsuario').value;
            document.getElementById('nombre').textContent = document.getElementById('inputNombre').value;
            document.getElementById('apellidos').textContent = document.getElementById('inputApellidos').value;
            document.getElementById('dni').textContent = document.getElementById('inputDni').value;
            document.getElementById('telefono').textContent = document.getElementById('inputTelefono').value;
        
            document.getElementById('formularioUsuario').style.display = 'none';
            document.getElementById('infoUsuario').style.display = 'block';
        });
        

        // Sección de edición de hijos

        /* script.js */

let contador = 0;
const contenedorHijos = document.getElementById('hijos');
const hijoModelo = document.getElementById('hijoModelo');

function agregarHijo() {
    contador++;
    const nuevoHijo = hijoModelo.cloneNode(true);
    nuevoHijo.style.display = 'block';
    nuevoHijo.classList.remove('modelo');
    nuevoHijo.id = `hijo${contador}`;

    nuevoHijo.querySelector('.btnEditar').addEventListener('click', () => editarHijo(nuevoHijo));
    nuevoHijo.querySelector('.btnEliminar').addEventListener('click', () => nuevoHijo.remove());
    nuevoHijo.querySelector('.btnGuardar').addEventListener('click', () => guardarHijo(nuevoHijo));

    contenedorHijos.appendChild(nuevoHijo);
}

function editarHijo(hijo) {
    const formulario = hijo.querySelector('.formulario');
    formulario.querySelector('.inputNombre').value = hijo.querySelector('.nombre').textContent;
    formulario.querySelector('.inputApellidos').value = hijo.querySelector('.apellidos').textContent;
    formulario.querySelector('.inputFecha').value = hijo.querySelector('.fecha').textContent;
    formulario.querySelector('.inputTelefono').value = hijo.querySelector('.telefono').textContent;
    formulario.style.display = 'block';
}

function guardarHijo(hijo) {
    const formulario = hijo.querySelector('.formulario');
    hijo.querySelector('.nombre').textContent = formulario.querySelector('.inputNombre').value;
    hijo.querySelector('.apellidos').textContent = formulario.querySelector('.inputApellidos').value;
    hijo.querySelector('.fecha').textContent = formulario.querySelector('.inputFecha').value;
    hijo.querySelector('.telefono').textContent = formulario.querySelector('.inputTelefono').value;
    formulario.style.display = 'none';
}

document.getElementById('btnAgregar').addEventListener('click', agregarHijo);

//validacion de campos

/* validaciones.js */

document.getElementById("responsable-adicional").addEventListener("change", function() {
    const responsableInfo = document.getElementById("responsable-info");
    if (this.value === "si") {
        responsableInfo.classList.remove("hidden");
    } else {
        responsableInfo.classList.add("hidden");
    }
});


// seccion de actividades

// Datos de las actividades
const activities = [
    "Presentación Monster",
    "Super burbujas de colores",
    "Pasta de Monster",
    "Super slime",
    "Actividad pasivo Monster (meditación)",
    "Circuito activo Monster"
];

// Datos del horario
const schedule = [
    { day: "Lunes", activity: "Presentación Monster" },
    { day: "Martes", activity: "Super burbujas de colores" },
    { day: "Miércoles", activity: "Pasta de Monster" },
    { day: "Jueves", activity: "Super slime" },
    { day: "Viernes", activity: "Actividad pasivo Monster (meditación)" },
    { day: "Sábado", activity: "Circuito activo Monster" }
];

// Datos del padre y del hijo
const fatherName = "Juan Pérez";
const childName = "Luis Pérez";

// Función para cargar las actividades
function loadActivities() {
    const activitiesList = document.getElementById("activities-list");
    activities.forEach(activity => {
        const li = document.createElement("li");
        li.textContent = activity;
        activitiesList.appendChild(li);
    });
}

// Función para cargar el horario
function loadSchedule() {
    const scheduleTable = document.getElementById("schedule-table");
    schedule.forEach(item => {
        const row = document.createElement("tr");
        const dayCell = document.createElement("td");
        const activityCell = document.createElement("td");

        dayCell.textContent = item.day;
        activityCell.textContent = item.activity;

        row.appendChild(dayCell);
        row.appendChild(activityCell);
        scheduleTable.appendChild(row);
    });
}

// Función para cargar los nombres del padre y del hijo
function loadNames() {
    document.getElementById("father-name").textContent = fatherName;
    document.getElementById("child-name").textContent = childName;
}

// Cargar todo al iniciar la página
window.onload = function() {
    loadActivities();
    loadSchedule();
    loadNames();
};

