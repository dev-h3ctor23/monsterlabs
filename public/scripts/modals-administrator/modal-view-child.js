document.addEventListener('DOMContentLoaded', () => {
    const viewChildModal = document.getElementById('view-child-modal');
    const closeViewChildBtn = document.getElementById('close-view-child');

    console.log('DOM fully loaded and parsed');

    // Función para asignar eventos de clic a los botones amarillos
    function assignClickEvents() {
        console.log('Assigning click events to yellow buttons');
        const yellowButtons = document.querySelectorAll('.btn-yellow');
        console.log(`Found ${yellowButtons.length} yellow buttons`);
        yellowButtons.forEach(button => {
            console.log('Assigning click event to button:', button.id);
            button.addEventListener('click', (event) => {
                console.log('Yellow button clicked');
                const row = event.target.closest('tr');
                console.log('Row found:', row);
                const childName = row.querySelector('.name').textContent.trim();
                console.log('Child name:', childName);
                const childSurname = 'Apellido'; // Reemplaza con el apellido real
                console.log('Child surname:', childSurname);
                const childDob = '01/01/2010'; // Reemplaza con la fecha de nacimiento real
                console.log('Child DOB:', childDob);
                const parentName = 'Nombre del Padre'; // Reemplaza con el nombre real del padre
                console.log('Parent name:', parentName);
                const parentSurname = 'Apellido del Padre'; // Reemplaza con el apellido real del padre
                console.log('Parent surname:', parentSurname);
                const parentEmail = 'padre@ejemplo.com'; // Reemplaza con el correo electrónico real del padre
                console.log('Parent email:', parentEmail);

                document.getElementById('child-name').textContent = childName;
                document.getElementById('child-surname').textContent = childSurname;
                document.getElementById('child-dob').textContent = childDob;
                document.getElementById('parent-name').textContent = parentName;
                document.getElementById('parent-surname').textContent = parentSurname;
                document.getElementById('parent-email').textContent = parentEmail;

                console.log('Setting modal content:');
                console.log('Child name:', childName);
                console.log('Child surname:', childSurname);
                console.log('Child DOB:', childDob);
                console.log('Parent name:', parentName);
                console.log('Parent surname:', parentSurname);
                console.log('Parent email:', parentEmail);

                viewChildModal.classList.add('show');
                console.log('View child modal should be shown now');
            });
        });
    }

    // Asignar eventos de clic a los botones amarillos al cargar la página
    assignClickEvents();

    closeViewChildBtn.addEventListener('click', () => {
        console.log('Close view child button clicked');
        viewChildModal.classList.remove('show');
    });

    // Observar cambios en el DOM para reasignar eventos de clic a los nuevos botones amarillos
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('DOM mutation detected, reassigning click events');
                assignClickEvents();
            }
        }
    });
    //Hola
    observer.observe(document.getElementById('inactive-children-table-body'), { childList: true, subtree: true });
});