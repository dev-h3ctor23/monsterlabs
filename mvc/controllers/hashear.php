<?php
// Conexión a la base de datos
$servername = "localhost";  // Cambia esto si tu servidor de base de datos es diferente
$username = "root";         // Nombre de usuario para la base de datos
$password = "";             // Contraseña de la base de datos
$dbname = "monsterlab";    // Nombre de tu base de datos

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener todas las contraseñas de la base de datos
$sql = "SELECT id_usuario, contrasena FROM Usuario";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Recorremos todas las filas
    while($row = $result->fetch_assoc()) {
        // Hashear la contraseña
        $hashedPassword = password_hash($row['contrasena'], PASSWORD_DEFAULT);

        // Actualizar la contraseña hasheada en la base de datos
        $updateSql = "UPDATE Usuario SET contrasena = '$hashedPassword' WHERE id_usuario = " . $row['id_usuario'];
        
        if ($conn->query($updateSql) === TRUE) {
            echo "Contraseña de usuario ID " . $row['id_usuario'] . " actualizada con éxito.<br>";
        } else {
            echo "Error al actualizar la contraseña de usuario ID " . $row['id_usuario'] . ": " . $conn->error . "<br>";
        }
    }
} else {
    echo "No se encontraron usuarios en la base de datos.";
}

// Cerrar la conexión
$conn->close();
?>