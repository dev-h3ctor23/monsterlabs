// Abrir el modal de añadir monitor
document.getElementById('add-monitor-btn').addEventListener('click', function() {
    document.getElementById('add-monitor-modal').classList.add('show');
});

// Cerrar el modal de añadir monitor
document.getElementById('cancel-add-monitor').addEventListener('click', function() {
    document.getElementById('add-monitor-modal').classList.remove('show');
});