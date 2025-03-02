// TODO : script-sidebar-administrator.js: Implementar la funcionalidad de la barra lateral del administrador. //

// ? : Importar constantes de elementos HTML
    // * body: Elemento HTML <body>
    // * sidebar: Elemento HTML con la clase .sidebar
    // * toggle: Elemento HTML con la clase .toggle
    // * modeSwitch: Elemento HTML con la clase .toggle-switch
    // * modeText: Elemento HTML con la clase .mode-text

const body = document.querySelector('body'),
    sidebar = document.querySelector('.sidebar'),
    toggle = document.querySelector('.toggle'),
    modeText = body.querySelector(".mode-text");

// ? : Listener para cambiar el modo de la barra lateral para abrir o cerrar.
toggle.addEventListener("click", () => { // * : Al hacer clic en el botón de alternar.
    sidebar.classList.toggle("close");  
    document.body.classList.toggle("sidebar-closed");  
});



