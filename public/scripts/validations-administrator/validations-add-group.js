const addGroupForm = document.getElementById('add-group-form');
const groupName = document.getElementById('group-name');
const groupNameError = document.getElementById('group-name-error');
const selectedMonitors = document.getElementById('selected-monitors');
const selectedChildren = document.getElementById('selected-children');
const monitorSelect = document.getElementById('monitor-select');
const childSelect = document.getElementById('child-select');
const monitorError = document.createElement('span');
const childError = document.createElement('span');

monitorError.className = 'error-message';
childError.className = 'error-message';
selectedMonitors.parentNode.insertBefore(monitorError, selectedMonitors.nextSibling);
selectedChildren.parentNode.insertBefore(childError, selectedChildren.nextSibling);

function validateGroupName() {
    const name = groupName.value.trim();
    if (name === '') {
        groupNameError.textContent = 'El nombre del grupo no puede estar vacío.';
        groupNameError.style.display = 'block';
        groupName.style.borderColor = 'red';
        return false;
    }
    groupNameError.style.display = 'none';
    groupName.style.borderColor = '';
    return true;
}

function validateMonitors() {
    if (selectedMonitors.children.length > 5) {
        monitorError.textContent = 'No se pueden añadir más de 5 monitores.';
        monitorError.style.display = 'block';
        return false;
    }
    monitorError.style.display = 'none';
    return true;
}

function validateChildren() {
    if (selectedChildren.children.length > 10) {
        childError.textContent = 'No se pueden añadir más de 10 niños.';
        childError.style.display = 'block';
        return false;
    }
    childError.style.display = 'none';
    return true;
}

groupName.onblur = validateGroupName;

document.getElementById('add-monitor-to-group').addEventListener('click', function() {
    if (selectedMonitors.children.length < 5) {
        const monitor = monitorSelect.options[monitorSelect.selectedIndex].text;
        const monitorItem = document.createElement('div');
        monitorItem.textContent = monitor;
        selectedMonitors.appendChild(monitorItem);
        validateMonitors();
    } else {
        validateMonitors();
    }
});

document.getElementById('add-child-to-group').addEventListener('click', function() {
    if (selectedChildren.children.length < 10) {
        const child = childSelect.options[childSelect.selectedIndex].text;
        const childItem = document.createElement('div');
        childItem.textContent = child;
        selectedChildren.appendChild(childItem);
        validateChildren();
    } else {
        validateChildren();
    }
});

addGroupForm.addEventListener('submit', function(event) {
    event.preventDefault();
    if (!validateGroupName() || !validateMonitors() || !validateChildren()) {
        const error_popup_add = document.getElementById('popup-error-add');
        if (error_popup_add) {
            error_popup_add.textContent = "Por favor, completa correctamente el formulario";
            error_popup_add.classList.add("show");
            error_popup_add.style.background = "#DC3545"; // Rojo
            setTimeout(() => {
                error_popup_add.classList.remove("show");
            }, 1000);
        } else {
            console.error("No se encontró el elemento con id 'popup-error-add'");
        }
    } else {
        document.getElementById('add-group-modal').classList.remove('show');
        const popup = document.getElementById('popup');
        popup.textContent = "Grupo añadido con éxito";
        popup.style.background = "#28A745"; // Verde
        popup.classList.add("show");
        setTimeout(() => {
            popup.classList.remove("show");
        }, 1000);
    }
});