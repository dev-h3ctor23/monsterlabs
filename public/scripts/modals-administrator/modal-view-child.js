document.addEventListener('DOMContentLoaded', () => {
    const viewChildModal = document.getElementById('view-child-modal');
    const closeViewChildBtn = document.getElementById('close-view-child');

    // Función para asignar eventos de clic a los botones amarillos
    function assignClickEvents() {
        const yellowButtons = document.querySelectorAll('.btn-yellow');
        yellowButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const row = event.target.closest('tr');
                const childName = row.querySelector('.name').textContent.trim();
                const childSurname = 'Apellido'; // Reemplaza con el apellido real
                const childDob = '01/01/2010'; // Reemplaza con la fecha de nacimiento real
                const parentName = 'Nombre del Padre'; // Reemplaza con el nombre real del padre
                const parentSurname = 'Apellido del Padre'; // Reemplaza con el apellido real del padre
                const parentEmail = 'padre@ejemplo.com'; // Reemplaza con el correo electrónico real del padre

                document.getElementById('child-name').textContent = childName;
                document.getElementById('child-surname').textContent = childSurname;
                document.getElementById('child-dob').textContent = childDob;
                document.getElementById('parent-name').textContent = parentName;
                document.getElementById('parent-surname').textContent = parentSurname;
                document.getElementById('parent-email').textContent = parentEmail;

                viewChildModal.classList.add('show');
            });
        });
    }

    // Asignar eventos de clic a los botones amarillos al cargar la página
    assignClickEvents();

    closeViewChildBtn.addEventListener('click', () => {
        viewChildModal.classList.remove('show');
    });

    // Observar cambios en el DOM para reasignar eventos de clic a los nuevos botones amarillos
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                assignClickEvents();
            }
        }
    });
    observer.observe(document.getElementById('children-table-body'), { childList: true, subtree: true });
    observer.observe(document.getElementById('children-table-body'), { childList: true, subtree: true });
});