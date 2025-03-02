<?php
$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "monsterlabs";
$sqlFile1   = 'sql/database.sql';
$sqlFile2   = 'sql/insertar-datos.sql';

$conn = new mysqli($servername, $username, $password);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// 1) LEEMOS y EJECUTAMOS el primer archivo: database.sql
$sql = file_get_contents($sqlFile1);
if ($sql === false) {
    die("Error al leer el archivo SQL: " . $sqlFile1);
}

// -- IMPORTANTE: Usar el if sin "=== TRUE"
if ($conn->multi_query($sql)) {
    // Consumimos todos los resultados del primer archivo
    do {
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());

    echo "Base de datos y tablas creadas exitosamente<br>";
} else {
    echo "Error al crear la base de datos y tablas: " . $conn->error . "<br>";
}

// 2) LEEMOS y EJECUTAMOS el segundo archivo: insertar-datos.sql
$sql = file_get_contents($sqlFile2);
if ($sql === false) {
    die("Error al leer el archivo SQL: " . $sqlFile2);
}

// -- Llamamos de nuevo a multi_query y consumimos resultados
if ($conn->multi_query($sql)) {
    do {
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());

    echo "Datos cargados exitosamente";
} else {
    echo "Error al insertar datos: " . $conn->error;
}

$conn->close();
?>