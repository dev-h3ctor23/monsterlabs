<?php
include(__DIR__ . '/../../config/conn.php');

if (isset($_GET['ninoId'])) {
    $ninoId = intval($_GET['ninoId']);
    
    // 1. Obtener el id_grupo del niño desde la tabla Nino
    $stmt = $conn->prepare("SELECT id_grupo FROM Nino WHERE id_nino = ?");
    $stmt->bind_param("i", $ninoId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $groupId = $row['id_grupo'];
    } else {
        echo json_encode([]);
        exit;
    }
    $stmt->close();
    
    // 2. Obtener los períodos asignados al niño (tabla PeriodoNino)
    $stmt = $conn->prepare("SELECT fecha_inicio_periodo, fecha_fin_periodo FROM PeriodoNino WHERE id_nino = ?");
    $stmt->bind_param("i", $ninoId);
    $stmt->execute();
    $periodos = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    
    // 3. Obtener las actividades programadas para el grupo (como plantilla)
    $stmt = $conn->prepare("SELECT c.hora_inicio, c.hora_fin, a.nombre_actividad 
                            FROM Cronograma c 
                            JOIN Actividad a ON c.id_actividad = a.id_actividad 
                            WHERE c.id_grupo = ?");
    $stmt->bind_param("i", $groupId);
    $stmt->execute();
    $cronogramaEvents = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    
    $events = [];
    
    // 4. Por cada período, iterar desde fecha_inicio_periodo hasta fecha_fin_periodo
    // y crear un evento para cada día hábil (lunes a viernes)
    foreach ($periodos as $periodo) {
        $startDate = new DateTime($periodo['fecha_inicio_periodo']);
        $endDate   = new DateTime($periodo['fecha_fin_periodo']);
        
        // Iteramos día a día, incluyendo el último día
        while ($startDate <= $endDate) {
            // La función format('N') devuelve 1 (lunes) hasta 7 (domingo)
            if ($startDate->format('N') <= 5) { // si es de lunes a viernes
                $fechaEvento = $startDate->format('Y-m-d');
                foreach ($cronogramaEvents as $cronograma) {
                    $start = $fechaEvento . 'T' . $cronograma['hora_inicio'];
                    $end   = $fechaEvento . 'T' . $cronograma['hora_fin'];
                    $events[] = [
                        'title' => $cronograma['nombre_actividad'],
                        'start' => $start,
                        'end'   => $end
                    ];
                }
            }
            $startDate->modify('+1 day');
        }
    }
    
    echo json_encode($events);
}
?>
