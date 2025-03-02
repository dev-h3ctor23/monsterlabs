<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "monsterlabs";
$sqlFile = 'sql/database.sql';

$conn = new mysqli($servername, $username, $password);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
$sql = file_get_contents($sqlFile);
if ($sql === false) {
    die("Error al leer el archivo SQL");
}
if ($conn->multi_query($sql) === TRUE) {
    echo "Base de datos y tablas creadas exitosamente";
} else {
    echo "Error al crear la base de datos y tablas: " . $conn->error;
}
$conn->close();
?>