<?php
// filepath: /C:/xampp/htdocs/monsterlabs/mvc/controllers/administrator/add_schedule.php
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

    $fecha = $data['fecha'];
    $hora_inicio = $data['hora_inicio'];
    $hora_fin = $data['hora_fin'];
    $id_actividad = $data['id_actividad'];
    $id_grupo = $data['id_grupo'];

    if (empty($fecha) || empty($hora_inicio) || empty($hora_fin) || empty($id_actividad) || empty($id_grupo)) {
        echo json_encode(['status' => 'error', 'message' => 'Faltan datos requeridos.']);
        exit;
    }

    $query = "INSERT INTO Cronograma (fecha, hora_inicio, hora_fin, id_actividad, id_grupo) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        echo json_encode(['status' => 'error', 'message' => 'Error en la preparación de la consulta: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param('sssii', $fecha, $hora_inicio, $hora_fin, $id_actividad, $id_grupo);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Cronograma añadido correctamente.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al añadir el cronograma: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido.']);
}
?>