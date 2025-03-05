//-----------------------ACTUALIZAR FOTO ------------------------
// Manejar la selección de archivos
const fileInput = document.getElementById('fileInput');
const editPhotoButton = document.getElementById('editPhoto');
const profileImage = document.getElementById('profileImage');

// Cargar la foto al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    fetch('../../../mvc/controllers/administrator/get_photo.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                profileImage.src = data.foto;
            } else {
                console.error('Error al cargar la foto:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Abrir el selector de archivos al hacer clic en el botón
editPhotoButton.addEventListener('click', function () {
    fileInput.click(); // Simular un clic en el input de archivo
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

        fetch('../../../mvc/controllers/administrator/edit_photo.php', {
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