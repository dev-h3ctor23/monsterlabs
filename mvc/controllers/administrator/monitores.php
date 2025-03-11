
<?php
header('Content-Type: application/json');

require_once 'c:\xampp\htdocs\monsterlabs\config\conn.php';

$sql = "SELECT id_monitor, nombre, apellido FROM Monitor";
$result = $conn->query($sql);

$monitores = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $monitores[] = $row;
    }
}

echo json_encode($monitores);
$conn->close();
