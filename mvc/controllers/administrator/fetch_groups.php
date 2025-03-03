<?php
// filepath: /C:/xampp/htdocs/monsterlabs/mvc/controllers/administrator/fetch_groups.php
require_once '../../../config/conn.php';

header('Content-Type: application/json');

$query = "SELECT id_grupo, nombre_grupo FROM Grupo";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $groups = [];
    while ($row = $result->fetch_assoc()) {
        $groups[] = $row;
    }
    echo json_encode(['status' => 'success', 'groups' => $groups]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se encontraron grupos.']);
}

$conn->close();
?>