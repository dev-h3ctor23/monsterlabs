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
    $contrasena = trim($data['contrasena']);
    
    // Preparar la consulta para buscar el usuario, obteniendo la contraseña y el nombre_tipo
    $stmt = $conn->prepare("SELECT contrasena, nombre_tipo FROM Usuario WHERE nombre_usuario = ?");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["error" => "Error al preparar la consulta."]);
        exit;
    }
    
    $stmt->bind_param("s", $nombre_usuario);
    
    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(["error" => "Error al ejecutar la consulta."]);
        exit;
    }
    
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(400);
        echo json_encode(["error" => "El usuario no existe."]);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    $row = $result->fetch_assoc();
    
    // Verificar la contraseña usando password_verify
    if (!password_verify($contrasena, $row['contrasena'])) {
        http_response_code(400);
        echo json_encode(["error" => "Contraseña incorrecta."]);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    // Aseguramos que el valor de nombre_tipo esté en minúsculas para la comparación
    $nombre_tipo = strtolower(trim($row["nombre_tipo"]));
    if ($nombre_tipo === "padre") {
        $redirectUrl = "/monsterlabs/mvc/views/tutor.html";
    } elseif ($nombre_tipo === "admin") {
        $redirectUrl = "/monsterlabs/mvc/views/administrator.html";
    } elseif ($nombre_tipo === "monitor") {
        $redirectUrl = "/monsterlabs/mvc/views/monitor.html";
    } else {
        $redirectUrl = "/monsterlabs/mvc/error-404.html";
    }
    
    http_response_code(200);
    echo json_encode([
        "message"  => "Inicio de sesión exitoso.",
        "redirect" => $redirectUrl
    ]);
    
    $stmt->close();
    $conn->close();
    
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
}
?>