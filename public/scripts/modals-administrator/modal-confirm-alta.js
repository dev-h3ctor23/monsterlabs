document.addEventListener('DOMContentLoaded', () => {
    const altaModal = document.getElementById('confirm-alta-modal');
    const confirmAltaBtn = document.getElementById('confirm-alta');
    const cancelAltaBtn = document.getElementById('cancel-alta');

    document.querySelectorAll('.btn-green').forEach(button => {
        button.addEventListener('click', () => {
            altaModal.classList.add('show');
        });
    });

    cancelAltaBtn.addEventListener('click', () => {
        altaModal.classList.remove('show');
    });

    confirmAltaBtn.addEventListener('click', () => {
        // Aquí puedes añadir la lógica para dar de alta al participante
        altaModal.classList.remove('show');
        alert('Participante dado de alta');
    });
});