<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

// Verificar que el usuario esté logueado y sea monitor
if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'monitor') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

include(__DIR__ . '/../../../config/conn.php');

// Obtener la fecha enviada por GET (se espera en formato YYYY-MM-DD)
$fecha = isset($_GET['fecha']) ? $_GET['fecha'] : '';
if (!$fecha) {
    echo json_encode(['status' => 'error', 'message' => 'Fecha no proporcionada']);
    exit;
}

// Validar el formato de la fecha
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
    echo json_encode(['status' => 'error', 'message' => 'Formato de fecha no válido']);
    exit;
}

// Obtener el id_usuario de la sesión y luego el id_monitor del monitor correspondiente
$user_id = $_SESSION['id_usuario'];

// Primero, obtenemos el id_monitor del monitor en sesión
$stmt1 = $conn->prepare("SELECT id_monitor FROM Monitor WHERE id_usuario = ?");
$stmt1->bind_param("i", $user_id);
$stmt1->execute();
$stmt1->store_result();
$stmt1->bind_result($monitor_id);
if ($stmt1->num_rows > 0) {
    $stmt1->fetch();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Monitor no encontrado']);
    exit;
}
$stmt1->close();

// Consultar la asistencia de los niños en el grupo del monitor para la fecha seleccionada
$query = "SELECT n.id_nino, n.nombre, n.apellido, a.estado
          FROM Nino n
          JOIN Grupos g ON n.id_nino = g.id_nino
          LEFT JOIN Asistencia a ON n.id_nino = a.id_nino AND a.fecha = ?
          WHERE g.id_monitor = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("si", $fecha, $monitor_id);
$stmt->execute();
$result = $stmt->get_result();

$asistencia = [];
while ($row = $result->fetch_assoc()) {
    $asistencia[] = $row;
}

// Devolver los datos en formato JSON
echo json_encode(['status' => 'success', 'asistencia' => $asistencia]);

$stmt->close();
$conn->close();
?>