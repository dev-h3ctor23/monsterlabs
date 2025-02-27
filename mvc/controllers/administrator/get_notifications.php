<?php

session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

include(__DIR__ . '/../../../config/conn.php');

// Manejo de errores
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // Obtener todas las notificaciones
    $notificationsQuery = "
        SELECT n.id_notificacion, n.asunto, n.fecha, u.nombre_usuario AS emisor, u.nombre_tipo AS tipo_usuario
        FROM Notificaciones n
        JOIN Usuario u ON n.id_usuario = u.id_usuario
    ";
    $stmt = $conn->prepare($notificationsQuery);
    $stmt->execute();
    $result = $stmt->get_result();

    $notifications = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $notifications[] = $row;
        }
    }

    $stmt->close();
    $conn->close();

    echo json_encode(["status" => "success", "notifications" => $notifications]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>