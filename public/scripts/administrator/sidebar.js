
// ---------------------CODIGO PARA CUANDO SE VUELE ATRAS AL CERRAR SESION-----------------------º
// Empuja un estado al historial
window.history.pushState(null, null, window.location.href);

// Listener para el evento popstate (cuando se presiona "atrás")
window.addEventListener('popstate', function (event) {
window.location.replace("../../../mvc/views/log-in.html");
});

// Listener para el evento pageshow (para detectar carga desde la cache)
window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    window.location.replace("../../../mvc/views/log-in.html");
  }
});

document.addEventListener("DOMContentLoaded", function() {
    fetch('../../components/sidebar-administrator.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
            setupTabSwitching();
        })
        .catch(error => console.error('Error al cargar el sidebar:', error));
});

function setupTabSwitching() {
    const tabs = document.querySelectorAll('.tabs input[type="radio"]');
    tabs.forEach(tab => {
        tab.addEventListener('change', function() {
            const contentSections = document.querySelectorAll('.content-section');
            contentSections.forEach(section => section.style.display = 'none');
            document.getElementById(`${this.id}-content`).style.display = 'block';
        });
    });
}

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