const body = document.querySelector('body'),
    sidebar = body.querySelector('nav'),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

// Alternar visibilidad de la barra lateral
toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});

// Mostrar la barra lateral cuando se hace clic en el cuadro de búsqueda
if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        sidebar.classList.remove("close");
    });
}

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
// ! NO TOCAR HASTA NUEVO AVISO :D -> Alternar modo oscuro y actualizar el texto del modo
// modeSwitch.addEventListener("click", () => {
//     body.classList.toggle("dark");

//     Actualizar el texto del modo según el modo actual
//     if (body.classList.contains("dark")) {
//         modeText.innerText = "Light mode";
//     } else {
//         modeText.innerText = "Dark mode";
//     }
// });