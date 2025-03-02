<?php
session_start();
header("Content-Type: application/json");

// Verificar si el usuario está autenticado y es de tipo 'monitor'
if (!isset($_SESSION['id_usuario']) || $_SESSION['tipo_usuario'] !== 'monitor') {
    echo json_encode(["status" => "error", "message" => "Acceso denegado", "redirect" => "/monsterlabs/index.php"]);
    exit;
}

require_once(__DIR__ . '/../../../config/conn.php'); // Incluir la conexión a la base de datos

$user_id = $_SESSION['id_usuario']; // Obtener el ID del usuario desde la sesión

// Verificar si se recibió un archivo
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['foto'])) {
    $file = $_FILES['foto'];

    // Verificar si no hubo errores en la subida
    if ($file['error'] === UPLOAD_ERR_OK) {
        $rutaDestino = $_SERVER['DOCUMENT_ROOT'] . '/monsterlabs/assets/fotoUsuarios/'; // Ruta absoluta en el servidor
        $nombreArchivo = uniqid() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($file['name'])); // Nombre único para el archivo
        $rutaRelativa = '/monsterlabs/assets/fotoUsuarios/' . $nombreArchivo; // Ruta relativa para la base de datos
        $rutaCompleta = $rutaDestino . $nombreArchivo; // Ruta absoluta para mover el archivo

        // Verificar si la carpeta de destino existe y tiene permisos de escritura
        if (!is_dir($rutaDestino)) {
            echo json_encode(["status" => "error", "message" => "La carpeta de destino no existe"]);
            exit;
        }

        if (!is_writable($rutaDestino)) {
            echo json_encode(["status" => "error", "message" => "La carpeta de destino no tiene permisos de escritura"]);
            exit;
        }

        // Mover el archivo a la carpeta de destino
        if (move_uploaded_file($file['tmp_name'], $rutaCompleta)) {
            // Guardar la ruta relativa en la base de datos
            $stmt = $conn->prepare("UPDATE Usuario SET foto = ? WHERE id_usuario = ?");
            $stmt->bind_param('si', $rutaRelativa, $user_id);

            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Foto subida y guardada en la base de datos"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Error al guardar la ruta en la base de datos"]);
            }

            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Error al mover el archivo"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error en la subida del archivo"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No se recibió ningún archivo"]);
}

$conn->close(); // Cerrar la conexión a la base de datos
?>