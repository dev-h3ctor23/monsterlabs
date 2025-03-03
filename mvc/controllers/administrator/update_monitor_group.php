<?php
// filepath: /C:/xampp/htdocs/monsterlabs/mvc/controllers/administrator/update_monitor_group.php
require_once '../../../config/conn.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Leer el cuerpo de la solicitud y decodificar JSON
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['status' => 'error', 'message' => 'Error al decodificar JSON: ' . json_last_error_msg()]);
        exit;
    }

    $monitorId = $data['monitor_id'];
    $groupId = $data['group_id'];

    if (empty($monitorId) || empty($groupId)) {
        echo json_encode(['status' => 'error', 'message' => 'Faltan datos requeridos.']);
        exit;
    }

    // Depuración: Verificar los valores de $monitorId y $groupId
    error_log("monitorId: $monitorId, groupId: $groupId");

    $query = "UPDATE Monitor SET id_grupo = ? WHERE id_monitor = ?";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        error_log('Error en la preparación de la consulta: ' . $conn->error);
        echo json_encode(['status' => 'error', 'message' => 'Error en la preparación de la consulta: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param('ii', $groupId, $monitorId);

    if ($stmt->execute()) {
        error_log('Consulta ejecutada correctamente.');
        echo json_encode(['status' => 'success', 'message' => 'Grupo del monitor actualizado correctamente.']);
    } else {
        error_log('Error al ejecutar la consulta: ' . $stmt->error);
        echo json_encode(['status' => 'error', 'message' => 'Error al actualizar el grupo del monitor: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    error_log('Método no permitido: ' . $_SERVER['REQUEST_METHOD']);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido.']);
}
?>