function validateImageFile(file) {
    if (!file) {
        return { valid: false, error: "No se ha seleccionado ningún archivo." };
    }
    if (!file.type.startsWith("image/")) {
        return { valid: false, error: "El archivo seleccionado no es una imagen." };
    }
    if (
        !file.name.toLowerCase().endsWith(".jpg") &&
        !file.name.toLowerCase().endsWith(".jpeg")
    ) {
        return { valid: false, error: "La foto debe tener extensión .jpg." };
    }
    // Si pasa las validaciones sincrónicas, se procede a revisar las dimensiones.
    return { valid: true };
}

function validatePhotoUpload() {
    return new Promise((resolve) => {
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];

        // Validación sincrónica
        const syncValidation = validateImageFile(file);
        if (!syncValidation.valid) {
            resolve(syncValidation);
            return;
        }

        // Validación asíncrona: dimensiones
        const img = new Image();
        img.onload = function () {
            if (img.width !== 450 || img.height !== 450) {
                resolve({ valid: false, error: "La foto debe ser de 450px x 450px." });
            } else {
                resolve({ valid: true });
            }
        };
        img.onerror = function () {
            resolve({ valid: false, error: "No se pudo leer la imagen." });
        };
        img.src = URL.createObjectURL(file);
    });
}