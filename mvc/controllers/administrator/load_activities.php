<?php
// filepath: /C:/xampp/htdocs/monsterlabs/mvc/controllers/administrator/load_activities.php
require_once '../../../config/conn.php';

header('Content-Type: application/json');

$query = "SELECT id_actividad, nombre_actividad FROM Actividad";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $activities = [];
    while ($row = $result->fetch_assoc()) {
        $activities[] = $row;
    }
    echo json_encode(['status' => 'success', 'activities' => $activities]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se encontraron actividades.']);
}

$conn->close();
?>