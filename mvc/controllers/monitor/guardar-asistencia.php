<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

// Verificar que el usuario esté logueado y sea monitor
if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'monitor') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado", "redirect" => "/monsterlabs/index.php"]);
    exit;
}

require_once(__DIR__ . '/../../../config/conn.php');

// Leer los datos JSON enviados desde Fetch
$data = json_decode(file_get_contents("php://input"), true);

// Verificar si hay datos
if (!isset($data['fecha']) || !isset($data['asistencia'])) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    exit;
}

$fecha = $data['fecha'];
$asistencia = $data['asistencia'];

// Validar el formato de la fecha
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
    echo json_encode(['status' => 'error', 'message' => 'Fecha no válida']);
    exit;
}

// Iniciar la inserción o actualización de asistencia
foreach ($asistencia as $item) {
    $nino_id = $item['id'];
    $estado = $item['estado'];

    // Validar el estado
    if ($estado !== 'asistio' && $estado !== 'ausente') {
        echo json_encode(['status' => 'error', 'message' => 'Estado no válido']);
        exit;
    }

    // Verificar si ya existe un registro de asistencia para este niño en esta fecha
    $stmt_check = $conn->prepare("SELECT id_asistencia FROM asistencia WHERE id_nino = ? AND fecha = ?");
    $stmt_check->bind_param("is", $nino_id, $fecha);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        // Si existe, actualizar el registro
        $stmt = $conn->prepare("UPDATE asistencia SET estado = ? WHERE id_nino = ? AND fecha = ?");
        $stmt->bind_param("sis", $estado, $nino_id, $fecha);
    } else {
        // Si no existe, insertar un nuevo registro
        $stmt = $conn->prepare("INSERT INTO asistencia (id_nino, fecha, estado) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $nino_id, $fecha, $estado);
    }

    // Ejecutar la consulta
    if (!$stmt->execute()) {
        echo json_encode(["status" => "error", "message" => "Error al guardar la asistencia"]);
        $stmt->close();
        $stmt_check->close();
        $conn->close();
        exit;
    }

    // Cerrar las consultas
    $stmt->close();
    $stmt_check->close();
}

$conn->close();
echo json_encode(["status" => "success", "message" => "Asistencia guardada correctamente"]);
?>