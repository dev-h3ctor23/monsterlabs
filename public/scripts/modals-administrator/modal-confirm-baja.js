document.addEventListener('DOMContentLoaded', () => {
    const bajaModal = document.getElementById('confirm-baja-modal');
    const confirmBajaBtn = document.getElementById('confirm-baja');
    const cancelBajaBtn = document.getElementById('cancel-baja');

    // Deshabilitar temporalmente los eventos que abren el modal de eliminar participante
    const disableDeleteModalEvents = () => {
        document.querySelectorAll('.btn-action.btn-red').forEach(button => {
            button.removeEventListener('click', openDeleteModal);
        });
    };

    // Habilitar los eventos que abren el modal de eliminar participante
    const enableDeleteModalEvents = () => {
        document.querySelectorAll('.btn-action.btn-red').forEach(button => {
            button.addEventListener('click', openDeleteModal);
        });
    };

    // Función para abrir el modal de eliminar participante
    const openDeleteModal = (event) => {
        const deleteModal = document.getElementById('confirm-delete-modal');
        deleteModal.classList.add('show');
    };

    document.querySelectorAll('.btn-action.btn-red').forEach(button => {
        button.addEventListener('click', (event) => {
            // Evitar que otros modales se abran
            event.stopPropagation();
            disableDeleteModalEvents();
            bajaModal.classList.add('show');
        });
    });

    document.querySelectorAll('.btn-action.btn-baja').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            bajaModal.classList.add('show');
        });
    });

    cancelBajaBtn.addEventListener('click', () => {
        bajaModal.classList.remove('show');
        enableDeleteModalEvents();
    });

    confirmBajaBtn.addEventListener('click', () => {
        // Aquí puedes añadir la lógica para dar de baja al participante
        bajaModal.classList.remove('show');
        enableDeleteModalEvents();
        alert('Participante dado de baja');
    });
});