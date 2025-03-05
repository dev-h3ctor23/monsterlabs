<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'monitor') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado", "redirect" => "../../views/log-in.html"]);
    exit;
}

require_once(__DIR__ . '/../../../config/conn.php');

$user_id = $_SESSION['id_usuario'];


// Leer los datos JSON enviados desde Fetch
$data = json_decode(file_get_contents("php://input"), true);


// Procesar los datos recibidos
$asunto = $data['asunto'];
$descripcion = $data['descripcion'];

//Se incluye la fecha actual del envio
$fecha = (new DateTime())->format('Y-m-d');

//Insercion a la bbdd
$stmt1 = $conn->prepare("INSERT INTO Notificaciones (asunto, descripcion, fecha, id_usuario) VALUES (?, ?, ?, ?)");
$stmt1->bind_param("sssi", $asunto, $descripcion, $fecha, $user_id);

//
if ($stmt1->execute()) {
    echo json_encode(["status" => "success", "message" => "Mensaje enviado con éxito"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al enviar el mensaje"]);
}

$stmt1->close();
$conn->close();