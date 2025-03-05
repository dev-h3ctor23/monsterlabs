<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'monitor') {
    
    echo json_encode(["status" => "error", "message" => "Acceso denegado", "redirect" => "../../views/log-in.html"]);
    exit;
}

require_once(__DIR__ . '/../../../config/conn.php');


$user_id = $_SESSION['id_usuario'];

$stmt = $conn->prepare("SELECT nombre_usuario, correo, nombre_tipo, foto FROM Usuario WHERE id_usuario = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($username, $email, $user_type, $foto);

if ($stmt->num_rows > 0) {
    $stmt->fetch();
    $stmt2 = $conn->prepare("SELECT dni_monitor, nombre, apellido, numero_telefono FROM Monitor WHERE id_usuario = ?");
    $stmt2->bind_param("i", $user_id);
    $stmt2->execute();
    $stmt2->store_result();
    $stmt2->bind_result($dni, $nombre, $apellido, $telefono);

    if ($stmt2->num_rows > 0) {
        $stmt2->fetch();
        echo json_encode([
            "status" => "success",
            "usuario" => ["username" => $username, "email" => $email, "user_type" => $user_type, "foto" => $foto],
            "monitor" => ["dni" => $dni, "nombre" => $nombre, "apellido" => $apellido, "telefono" => $telefono]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "No se encontró información del monitor"]);
    }

    $stmt2->close();
} else {
    echo json_encode(["status" => "error", "message" => "No se encontró información del usuario"]);
}

$stmt->close();
$conn->close();
?>
