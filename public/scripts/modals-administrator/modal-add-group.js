document.getElementById('add-group-btn').addEventListener('click', function() {
    fetch('../../mvc/controllers/administrator/get_children_and_monitors.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const monitorSelect = document.getElementById('monitor-select');
                const childSelect = document.getElementById('child-select');

                // Limpiar los select
                monitorSelect.innerHTML = '';
                childSelect.innerHTML = '';

                // Llenar el select de monitores
                data.monitors.forEach(monitor => {
                    const option = document.createElement('option');
                    option.value = monitor.id_monitor;
                    option.textContent = `${monitor.nombre} ${monitor.apellido}`;
                    monitorSelect.appendChild(option);
                });

                // Llenar el select de niños
                data.children.forEach(child => {
                    const option = document.createElement('option');
                    option.value = child.id_nino;
                    option.textContent = `${child.nombre} ${child.apellido}`;
                    childSelect.appendChild(option);
                });

                // Mostrar el modal
                document.getElementById('add-group-modal').classList.add('show');
            } else {
                console.error('Error al cargar los datos:', data.message);
            }
        })
        .catch(error => console.error('Error al cargar los datos:', error));
});

document.getElementById('cancel-add-group').addEventListener('click', function() {
    document.getElementById('add-group-modal').classList.remove('show');
    document.getElementById('add-group-form').reset(); // Restaurar el formulario
    document.getElementById('selected-monitors').innerHTML = ''; // Limpiar la lista de monitores seleccionados
    document.getElementById('selected-children').innerHTML = ''; // Limpiar la lista de niños seleccionados

    // Restaurar las validaciones
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });
});

document.getElementById('add-monitor-to-group').addEventListener('click', function() {
    const monitorSelect = document.getElementById('monitor-select');
    const selectedMonitors = document.getElementById('selected-monitors');
    const monitor = monitorSelect.options[monitorSelect.selectedIndex].text;

    // Verificar si el monitor ya está en la lista
    if (!Array.from(selectedMonitors.children).some(item => item.textContent === monitor)) {
        const monitorItem = document.createElement('div');
        monitorItem.textContent = monitor;
        selectedMonitors.appendChild(monitorItem);
    }
});

document.getElementById('add-child-to-group').addEventListener('click', function() {
    const childSelect = document.getElementById('child-select');
    const selectedChildren = document.getElementById('selected-children');
    const child = childSelect.options[childSelect.selectedIndex].text;

    // Verificar si el niño ya está en la lista
    if (!Array.from(selectedChildren.children).some(item => item.textContent === child)) {
        const childItem = document.createElement('div');
        childItem.textContent = child;
        selectedChildren.appendChild(childItem);
    }
});