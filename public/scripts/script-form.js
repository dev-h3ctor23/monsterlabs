const forms = document.querySelector(".forms"),

  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link");

// ? Listener para el icono de ojo en los campos de contraseña.
pwShowHide.forEach(eyeIcon => {
  eyeIcon.addEventListener("click", () => { // * Evento de click en el icono de ojo.
    let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");

    pwFields.forEach(password => { // * Itera sobre los campos de contraseña.
      if (password.type === "password") { 
        password.type = "text"; // * Muestra el texto del campo de contraseña.
        eyeIcon.classList.replace("bx-hide", "bx-show"); // * Cambia el icono de ojo cerrado a ojo abierto.
        return;
      }
      password.type = "password"; // * Oculta el texto del campo de contraseña.
      eyeIcon.classList.replace("bx-show", "bx-hide"); // * Cambia el icono de ojo abierto a ojo cerrado.
    });

  });
});
