document.addEventListener("DOMContentLoaded", function() {
    fetch('../../mvc/controllers/administrator/administrador.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const userInfo = data.usuario;
                const adminInfo = data.administrador;

                document.getElementById("username-display").textContent = userInfo.username;
                document.getElementById("name-display").textContent = `${adminInfo.nombre} ${adminInfo.apellido}`;
                document.getElementById("email-display").textContent = userInfo.email;
                document.getElementById("phone-display").textContent = adminInfo.telefono;
            } else {
                console.error(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
});