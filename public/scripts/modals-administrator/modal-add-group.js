document.getElementById('add-group-btn').addEventListener('click', function() {
    document.getElementById('add-group-modal').classList.add('show');
});

document.getElementById('cancel-add-group').addEventListener('click', function() {
    document.getElementById('add-group-modal').classList.remove('show');
});

document.getElementById('add-monitor-to-group').addEventListener('click', function() {
    const monitorSelect = document.getElementById('monitor-select');
    const selectedMonitors = document.getElementById('selected-monitors');
    const monitor = monitorSelect.options[monitorSelect.selectedIndex].text;
    const monitorItem = document.createElement('div');
    monitorItem.textContent = monitor;
    selectedMonitors.appendChild(monitorItem);
});

document.getElementById('add-child-to-group').addEventListener('click', function() {
    const childSelect = document.getElementById('child-select');
    const selectedChildren = document.getElementById('selected-children');
    const child = childSelect.options[childSelect.selectedIndex].text;
    const childItem = document.createElement('div');
    childItem.textContent = child;
    selectedChildren.appendChild(childItem);
});