<?php
header("Content-Type: application/json");
require_once '../../config/conn.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['nombre_usuario']) || !isset($data['contrasena'])) {
        http_response_code(400);
        echo json_encode(["error" => "Campos requeridos no enviados."]);
        exit;
    }

    $nombre_usuario = trim($data['nombre_usuario']);
    $contrasena_plain = trim($data['contrasena']);

    $hashedPassword = password_hash($contrasena_plain, PASSWORD_DEFAULT);
    $defaultCorreo = $nombre_usuario . '@example.com';
    $nombre_tipo = "padre";

    // Verificar si el nombre de usuario ya existe
    $stmt = $conn->prepare("SELECT id_usuario FROM Usuario WHERE nombre_usuario = ?");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["error" => "Error al preparar la consulta."]);
        exit;
    }
    $stmt->bind_param("s", $nombre_usuario);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        http_response_code(400);
        echo json_encode(["error" => "El nombre de usuario ya está en uso."]);
        $stmt->close();
        $conn->close();
        exit;
    }
    $stmt->close();

    // Insertar el nuevo usuario
    $stmt = $conn->prepare("INSERT INTO Usuario (nombre_usuario, correo, contrasena, nombre_tipo) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["error" => "Error al preparar la consulta."]);
        exit;
    }
    $stmt->bind_param("ssss", $nombre_usuario, $defaultCorreo, $hashedPassword, $nombre_tipo);

    if($stmt->execute()){
        http_response_code(201);
        // echo json_encode(["message" => "Registro exitoso."]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error al registrar el usuario."]);
    }
    
    $stmt->close();
    $conn->close();
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
}
?>