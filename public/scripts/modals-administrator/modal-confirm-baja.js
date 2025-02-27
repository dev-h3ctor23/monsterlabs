document.addEventListener('DOMContentLoaded', () => {
    const bajaModal = document.getElementById('confirm-baja-modal');
    const confirmBajaBtn = document.getElementById('confirm-baja');
    const cancelBajaBtn = document.getElementById('cancel-baja');

    // Listener delegado para botones rojos CON data-active="1" (modal de dar de baja)
    document.addEventListener('click', (event) => {
        const redButton = event.target.closest('.btn-action.btn-red[data-active="1"]');
        if (redButton) {
            event.stopPropagation();
            // Extraer el ID del niño del botón clicado
            const childId = redButton.id.split('-')[2];
            // Almacenar el ID en el modal usando un atributo data
            bajaModal.dataset.childId = childId;
            bajaModal.classList.add('show');
        }
    });

    // Listener para botones rojos SIN data-active="1" (modal de eliminar)
    document.querySelectorAll('.btn-action.btn-red:not([data-active="1"])').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const deleteModal = document.getElementById('confirm-delete-modal');
            deleteModal.classList.add('show');
        });
    });

    // Listener para botones con clase btn-baja, si los hay
    document.querySelectorAll('.btn-action.btn-baja').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            bajaModal.classList.add('show');
        });
    });

    cancelBajaBtn.addEventListener('click', () => {
        bajaModal.classList.remove('show');
    });

    confirmBajaBtn.addEventListener('click', () => {
        // Leer el childId almacenado en el modal
        const childId = bajaModal.dataset.childId;
        if (!childId) {
            showPopup("No se encontró el ID del participante", "error");
            bajaModal.classList.remove('show');
            return;
        }
        
        fetch('../../mvc/controllers/administrator/unactivate_child.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_nino: childId })
        })
        .then(response => response.json())
        .then(data => {
            bajaModal.classList.remove('show');
            if (data.status === "success") {
                showPopup("Participante dado de baja", "success");
                // Buscar la fila en la tabla de niños activos mediante el botón rojo
                const redButton = document.getElementById(`btn-red-${childId}`);
                if (redButton) {
                    const row = redButton.closest("tr");
                    // Aplicar clase para animación de desvanecido
                    row.classList.add('fade-out');
                    setTimeout(() => {
                        // Remover la fila de la tabla activa tras la animación
                        row.remove();
                    }, 350);
                }
            } else {
                showPopup("Error al dar de baja: " + data.message, "error");
            }
        })
        .catch(error => {
            bajaModal.classList.remove('show');
            console.error('Error:', error);
            showPopup("Error al dar de baja", "error");
        });
    });

    // Función auxiliar para mostrar popups en lugar de alertas
    function showPopup(message, type) {
        const popup = document.getElementById('popup');
        popup.textContent = message;
        if (type === "success") {
            popup.className = "popup popup-success show";
        } else {
            popup.className = "popup popup-error show";
        }
        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000);
    }
});