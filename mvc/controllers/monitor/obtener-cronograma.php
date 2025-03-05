<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'monitor') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado", "redirect" => "../../views/log-in.html"]);
    exit;
}

require_once(__DIR__ . '/../../../config/conn.php');

$user_id = $_SESSION['id_usuario'];

// Obtener el ID del monitor y su grupo
$stmt = $conn->prepare("SELECT id_monitor, id_grupo FROM Monitor WHERE id_usuario = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($monitor_id, $grupo_id);

if ($stmt->num_rows > 0) {
    $stmt->fetch();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Monitor no encontrado']);
    exit;
}
$stmt->close();

// Obtener las actividades y el cronograma del grupo
$query = "
    SELECT 
        c.id_cronograma, 
        c.fecha, 
        c.hora_inicio, 
        c.hora_fin, 
        a.nombre_actividad, 
        a.descripcion 
    FROM Cronograma c
    JOIN Actividad a ON c.id_actividad = a.id_actividad
    WHERE c.id_grupo = ?
    ORDER BY c.fecha, c.hora_inicio
";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $grupo_id);
$stmt->execute();
$result = $stmt->get_result();

$actividades = [];
while ($row = $result->fetch_assoc()) {
    $actividades[] = $row;
}

echo json_encode(['status' => 'success', 'data' => $actividades]);
$stmt->close();
$conn->close();