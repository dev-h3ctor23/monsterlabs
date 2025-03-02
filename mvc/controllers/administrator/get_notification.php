<?php

session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

include(__DIR__ . '/../../../config/conn.php');

$id_notificacion = $_GET['id'];

try {
    $query = "SELECT n.asunto, n.fecha, n.descripcion, u.nombre_usuario AS emisor
              FROM Notificaciones n
              JOIN Usuario u ON n.id_usuario = u.id_usuario
              WHERE n.id_notificacion = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id_notificacion);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $notification = $result->fetch_assoc();
        echo json_encode(["status" => "success", "notification" => $notification]);
    } else {
        echo json_encode(["status" => "error", "message" => "No se encontró la notificación"]);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>