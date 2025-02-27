document.addEventListener('DOMContentLoaded', () => {
    const deleteModal = document.getElementById('confirm-delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const popup = document.getElementById('popup');
    let selectedChildId = null;

    console.log('DOM fully loaded and parsed');

    // Función para asignar eventos de clic a los botones rojos
    function assignClickEvents() {
        console.log('Assigning click events to red buttons');
        const redButtons = document.querySelectorAll('.btn-red');
        console.log(`Found ${redButtons.length} red buttons`);
        redButtons.forEach(button => {
            console.log('Assigning click event to button:', button.id);
            button.addEventListener('click', (event) => {
                selectedChildId = event.target.id.split('-')[2]; // Obtener el ID del niño del botón
                console.log(`Button red clicked, selectedChildId: ${selectedChildId}`);
                deleteModal.classList.add('show');
                console.log('Delete modal should be shown now');
            });
        });
    }

    // Asignar eventos de clic a los botones rojos al cargar la página
    assignClickEvents();

    cancelDeleteBtn.addEventListener('click', () => {
        console.log('Cancel delete button clicked');
        deleteModal.classList.remove('show');
        selectedChildId = null;
    });

    confirmDeleteBtn.addEventListener('click', () => {
        if (selectedChildId) {
            console.log(`Confirm delete button clicked, selectedChildId: ${selectedChildId}`);
            fetch(`../../mvc/controllers/administrator/delete_child.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_nino: selectedChildId })
            })
            .then(response => {
                console.log('Response received from server');
                return response.json();
            })
            .then(data => {
                console.log('Data received from server:', data);
                if (data.status === "success") {
                    console.log('Child deleted successfully');
                    deleteModal.classList.remove('show');
                    // Mostrar popup de éxito en rojo
                    popup.textContent = 'Eliminado correctamente';
                    popup.classList.add('popup-error'); // Cambiar a clase de error para que sea rojo
                    popup.classList.add('show');
                    setTimeout(() => {
                        popup.classList.remove('show');
                    }, 1000);

                    // Eliminar la fila del niño de la tabla de niños inactivos con animación de desvanecimiento
                    const row = document.querySelector(`#btn-red-${selectedChildId}`).closest('tr');
                    row.classList.add('fade-out');
                    setTimeout(() => {
                        row.remove();
                    }, 1000);
                } else {
                    console.error('Error:', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    // Observar cambios en el DOM para reasignar eventos de clic a los nuevos botones rojos
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('DOM mutation detected, reassigning click events');
                assignClickEvents();
            }
        }
    });
    observer.observe(document.getElementById('inactive-children-table-body'), { childList: true, subtree: true });
});