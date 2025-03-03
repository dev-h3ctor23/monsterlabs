<?php
session_start();
header("Content-Type: application/json");

// Verificar si el usuario está autenticado y es de tipo 'admin'
if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

require_once(__DIR__ . '/../../../config/conn.php'); // Incluir la conexión a la base de datos

$user_id = $_SESSION['id_usuario']; // Obtener el ID del usuario desde la sesión

// Recuperar la ruta de la foto desde la base de datos
$stmt = $conn->prepare("SELECT foto FROM Usuario WHERE id_usuario = ?");
$stmt->bind_param('i', $user_id);
$stmt->execute();
$stmt->bind_result($foto);
$stmt->fetch();
$stmt->close();
$conn->close();

if ($foto) {
    echo json_encode(["status" => "success", "foto" => $foto]);
} else {
    echo json_encode(["status" => "error", "message" => "No se encontró la foto"]);
}
?>