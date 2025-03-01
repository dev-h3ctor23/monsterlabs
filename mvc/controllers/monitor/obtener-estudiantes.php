<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

// Verificar que el usuario esté logueado y sea monitor
if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'monitor') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado", "redirect" => "/monsterlabs/index.php"]);
    exit;
}

require_once(__DIR__ . '/../../../config/conn.php');

// Obtener la fecha enviada por GET (se espera en formato YYYY-MM-DD)
$date = isset($_GET['date']) ? $_GET['date'] : '';
if (!$date) {
    echo json_encode(['status' => 'error', 'message' => 'Fecha no proporcionada']);
    exit;
}

if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    echo json_encode(['status' => 'error', 'message' => 'Formato de fecha no válido']);
    exit;
}

// Obtener el id_usuario de la sesión y luego el id_monitor del monitor correspondiente
$user_id = $_SESSION['id_usuario'];

// Primero, obtenemos el id_monitor del monitor en sesión
$stmt1 = $conn->prepare("SELECT id_monitor, id_grupo FROM Monitor WHERE id_usuario = ?");
$stmt1->bind_param("i", $user_id);
$stmt1->execute();
$stmt1->store_result();
$stmt1->bind_result($monitor_id, $grupo_id);
if ($stmt1->num_rows > 0) {
    $stmt1->fetch();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Monitor no encontrado']);
    exit;
}
$stmt1->close();

// Se consultan los niños que estén en el grupo del monitor y cuyo rango (fecha_inicio - fecha_fin) incluya la fecha seleccionada
$query = "SELECT n.id_nino, n.nombre, n.apellido, a.estado
        FROM Nino n
        LEFT JOIN Asistencia a ON n.id_nino = a.id_nino AND a.fecha = ?
        WHERE ? BETWEEN n.fecha_inicio AND n.fecha_fin
        AND n.id_grupo = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssi", $date, $date, $grupo_id);
$stmt->execute();
$result = $stmt->get_result();

$ninos = [];
while ($row = $result->fetch_assoc()) {
    $ninos[] = $row;
}

// Devolver los datos en formato JSON
echo json_encode(['status' => 'success', 'ninos' => $ninos]);

$stmt->close();
$conn->close();
?>
