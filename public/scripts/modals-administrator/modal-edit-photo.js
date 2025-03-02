document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.querySelector('.open-modal-btn');
    const modal = document.getElementById("modal");
    const closeModalBtn = document.getElementById("closeModal");
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");
    const preview = document.getElementById("preview");
    const uploadPhotoBtn = document.getElementById("uploadPhoto");
    const savePhotoBtn = document.getElementById("save-photo");
    const cancelPhotoBtn = document.getElementById("cancel-photo");
    const errorPopup = document.getElementById("popup-error-edit");
    const successPopup = document.getElementById("popup");

    // Abrir el modal al hacer click en "Cambiar foto"
    if (openModalBtn) {
        openModalBtn.addEventListener("click", () => {
            modal.classList.add("show");
        });
    }

    // Botón "Subir Foto": abre el explorador de archivos
    uploadPhotoBtn.addEventListener("click", () => {
        fileInput.click();
    });

    // Cerrar modal con "Cancelar" o botón de cerrar
    cancelPhotoBtn.addEventListener("click", closeModal);
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
    }
    window.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    function closeModal() {
        modal.classList.remove("show");
        clearPreview();
    }

    function clearPreview() {
        fileInput.value = "";
        preview.src = "";
        preview.style.display = "none";
    }

    // Manejar selección y vista previa de imagen
    fileInput.addEventListener("change", handleFiles);
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });
    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
    });
    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        if (e.dataTransfer.files && e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFiles();
        }
    });

    function handleFiles() {
        const file = fileInput.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    }

    // Botón "Guardar cambios": Actualiza la foto de perfil después de validar
    savePhotoBtn.addEventListener("click", async () => {
        const validation = await validatePhotoUpload();
        if (!validation.valid) {
            if (errorPopup) {
                errorPopup.textContent = validation.error || "Error desconocido.";
                errorPopup.classList.add("show");
                setTimeout(() => {
                    errorPopup.classList.remove("show");
                }, 1000);
            }
            return;
        }
        // Si es válida, actualiza la foto del perfil
        const profileImg = document.querySelector(".photo-container img");
        if (profileImg) {
            profileImg.src = preview.src;
        }
        if (successPopup) {
            successPopup.textContent = "Foto guardada con éxito";
            successPopup.classList.add("show");
            setTimeout(() => {
                successPopup.classList.remove("show");
            }, 1000);
        }
        closeModal();
    });
});