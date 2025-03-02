<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'admin') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

include(__DIR__ . '/../../../config/conn.php');

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'];
$name = $data['name'];
$surname = $data['surname'];
$dni = $data['dni'];
$phone = $data['phone'];
$email = $data['email'];
$user_id = $_SESSION['id_usuario'];

// Validar los datos recibidos
if (empty($username) || empty($name) || empty($surname) || empty($dni) || empty($phone) || empty($email)) {
    echo json_encode(["status" => "error", "message" => "Todos los campos son obligatorios"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "El formato del email no es válido"]);
    exit;
}

if (!preg_match('/^[0-9]{9}$/', $phone)) {
    echo json_encode(["status" => "error", "message" => "El número de teléfono debe contener 9 números"]);
    exit;
}

if (!preg_match('/^[0-9]{8}[A-Z]$/', $dni)) {
    echo json_encode(["status" => "error", "message" => "El formato del DNI no es válido"]);
    exit;
}

$stmt = $conn->prepare("UPDATE Usuario SET nombre_usuario = ?, correo = ? WHERE id_usuario = ?");
$stmt->bind_param("ssi", $username, $email, $user_id);

if ($stmt->execute()) {
    $stmt2 = $conn->prepare("UPDATE Administrador SET nombre = ?, apellido = ?, dni_admin = ?, numero_telefono = ? WHERE id_usuario = ?");
    $stmt2->bind_param("ssssi", $name, $surname, $dni, $phone, $user_id);

    if ($stmt2->execute()) {
        echo json_encode(["status" => "success", "message" => "Perfil actualizado con éxito"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al actualizar los datos del administrador"]);
    }

    $stmt2->close();
} else {
    echo json_encode(["status" => "error", "message" => "Error al actualizar los datos del usuario"]);
}

$stmt->close();
$conn->close();
?>