<?php

include_once '../../../config/conn.php';

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Error de conexión a la base de datos: ' . $conn->connect_error]));
}

$query = "SELECT id_grupo, nombre_grupo FROM grupo";
$result = $conn->query($query);

if ($result === false) {
    die(json_encode(['status' => 'error', 'message' => 'Error en la consulta: ' . $conn->error]));
}

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