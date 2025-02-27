document.addEventListener('DOMContentLoaded', () => {
    const altaModal = document.getElementById('confirm-alta-modal');
    const confirmAltaBtn = document.getElementById('confirm-alta');
    const cancelAltaBtn = document.getElementById('cancel-alta');
    const popup = document.getElementById('popup');
    let selectedChildId = null;

    // Función para asignar eventos de clic a los botones verdes
    function assignClickEvents() {
        document.querySelectorAll('.btn-green').forEach(button => {
            button.addEventListener('click', (event) => {
                selectedChildId = event.target.id.split('-')[2]; // Obtener el ID del niño del botón
                altaModal.classList.add('show');
            });
        });
    }

    // Asignar eventos de clic a los botones verdes al cargar la página
    assignClickEvents();

    cancelAltaBtn.addEventListener('click', () => {
        altaModal.classList.remove('show');
        selectedChildId = null;
    });

    confirmAltaBtn.addEventListener('click', () => {
        if (selectedChildId) {
            fetch(`../../mvc/controllers/administrator/activate_child.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_nino: selectedChildId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    altaModal.classList.remove('show');
                    // Mostrar popup de éxito
                    popup.textContent = 'Dado de alta correctamente';
                    popup.classList.add('show');
                    setTimeout(() => {
                        popup.classList.remove('show');
                    }, 1000);

                    // Eliminar la fila del niño de la tabla de niños inactivos con animación de desvanecimiento
                    const row = document.querySelector(`#btn-green-${selectedChildId}`).closest('tr');
                    row.classList.add('fade-out');
                    setTimeout(() => {
                        row.remove();
                    }, 1000);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    // Observar cambios en el DOM para reasignar eventos de clic a los nuevos botones verdes
    const observer = new MutationObserver(assignClickEvents);
    observer.observe(document.getElementById('inactive-children-table-body'), { childList: true });
});