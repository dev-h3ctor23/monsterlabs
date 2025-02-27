<?php

session_start();
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
    exit;
}

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

include(__DIR__ . '/../../../config/conn.php');

$id_notificacion = $_GET['id'];

try {
    $deleteQuery = "DELETE FROM Notificaciones WHERE id_notificacion = ?";
    $stmt = $conn->prepare($deleteQuery);
    $stmt->bind_param("i", $id_notificacion);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["status" => "success", "message" => "Notificación eliminada"]);
    } else {
        echo json_encode(["status" => "error", "message" => "No se encontró la notificación"]);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>