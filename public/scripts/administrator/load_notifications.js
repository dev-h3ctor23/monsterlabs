document.addEventListener('DOMContentLoaded', function() {
    fetch('../../mvc/controllers/administrator/get_notifications.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const notificationsContainer = document.querySelector('.notifications-container');
                notificationsContainer.innerHTML = ''; // Limpiar el contenedor de notificaciones

                data.notifications.forEach((notification, index) => {
                    const notificationRow = document.createElement('div');
                    notificationRow.classList.add('notification-row');
                    notificationRow.style.height = '32px'; // Altura de la fila

                    const notificationContent = `
                        <div class="notification-item">
                            <div class="notification-column">
                                <span class="notification-header">Emisor:</span>
                                <span>${notification.emisor}</span>
                            </div>
                            <div class="notification-column">
                                <span class="notification-header">Asunto:</span>
                                <span>${notification.asunto}</span>
                            </div>
                            <div class="notification-column">
                                <span class="notification-header">Fecha:</span>
                                <span>${notification.fecha}</span>
                            </div>
                            <div class="notification-buttons">
                                <button class="btn-yellow noti-btn" id="noti-yellow-${index}" data-id="${notification.id_notificacion}"></button>
                                <button class="btn-red noti-btn" id="noti-red-${index}" data-id="${notification.id_notificacion}"></button>
                            </div>
                        </div>
                    `;

                    notificationRow.innerHTML = notificationContent;
                    notificationsContainer.appendChild(notificationRow);

                    // Añadir evento de clic al botón amarillo
                    document.getElementById(`noti-yellow-${index}`).addEventListener('click', function() {
                        const notificationId = this.getAttribute('data-id');
                        fetch(`../../mvc/controllers/administrator/get_notification.php?id=${notificationId}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.status === "success") {
                                    document.getElementById('notification-subject').textContent = data.notification.asunto;
                                    document.getElementById('notification-date').textContent = data.notification.fecha;
                                    document.getElementById('notification-sender').textContent = data.notification.emisor;
                                    document.getElementById('notification-description').textContent = data.notification.descripcion;
                                    const modal = document.getElementById('view-notification-modal');
                                    modal.classList.add('show');
                                } else {
                                    console.error('Error al obtener la notificación:', data.message);
                                }
                            })
                            .catch(error => console.error('Error al obtener la notificación:', error));
                    });

                    // Añadir evento de clic al botón rojo
                    document.getElementById(`noti-red-${index}`).addEventListener('click', function() {
                        const notificationId = this.getAttribute('data-id');
                        const modal = document.getElementById('confirm-delete-notification-modal');
                        modal.classList.add('show');

                        // Confirmar eliminación
                        document.getElementById('confirm-delete-notification').onclick = function() {
                            fetch(`../../mvc/controllers/administrator/delete_notification.php?id=${notificationId}`, {
                                method: 'DELETE'
                            })
                            .then(response => response.json())
                            .then(result => {
                                if (result.status === 'success') {
                                    notificationRow.classList.add('fade-out');
                                    setTimeout(() => {
                                        notificationRow.remove();
                                    }, 300);
                                } else {
                                    console.error('Error al eliminar la notificación:', result.message);
                                }
                            })
                            .catch(error => console.error('Error al eliminar la notificación:', error));
                            modal.classList.remove('show');
                        };

                        // Cancelar eliminación
                        document.getElementById('cancel-delete-notification').onclick = function() {
                            modal.classList.remove('show');
                        };
                    });
                });

                // Añadir evento de clic al botón de cerrar del modal de visualización
                document.getElementById('close-view-notification').addEventListener('click', function() {
                    const modal = document.getElementById('view-notification-modal');
                    modal.classList.remove('show');
                });
            } else {
                console.error('Error al cargar las notificaciones:', data.message);
            }
        })
        .catch(error => console.error('Error al cargar las notificaciones:', error));
});