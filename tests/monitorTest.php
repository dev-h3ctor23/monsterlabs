<?php

use PHPUnit\Framework\TestCase;

class MonitorTest extends TestCase
{
    protected function setUp(): void
    {
        // Desactivar la visualización de errores
        error_reporting(0);
        ini_set('display_errors', 0);

        // Iniciar la sesión para las pruebas
        if (session_status() === PHP_SESSION_NONE) {
            @session_start(); // Suprimir errores de session_start()
        }

        // Simular un usuario monitor en la sesión
        $_SESSION['id_usuario'] = 4;
        $_SESSION['tipo_usuario'] = 'monitor';
    }

    protected function tearDown(): void
    {
        // Limpiar la sesión después de cada prueba
        session_unset();
        session_destroy();
    }

    public function testAccesoDenegado()
    {
        // Simular un usuario no autorizado
        unset($_SESSION['id_usuario']);

        // Capturar la salida del script
        ob_start();
        include __DIR__ . '/../mvc/controllers/monitor/usuario.php';
        $output = ob_get_clean();

        // Decodificar la salida JSON
        $response = json_decode($output, true);

        // Verificar que el acceso fue denegado
        $this->assertEquals("error", $response['status']);
        $this->assertEquals("Acceso denegado", $response['message']);
        $this->assertEquals("/monsterlabs/mvc/views/log-in.html", $response['redirect']);
    }

    public function testInformacionUsuarioYMonitor()
    {
        // Simular una conexión a la base de datos (usando un mock)
        $mockConn = $this->createMock(mysqli::class);
        $mockStmt = $this->createMock(mysqli_stmt::class);
        $mockStmt2 = $this->createMock(mysqli_stmt::class);

        // Configurar los mocks para la primera consulta
        $mockConn->method('prepare')->willReturn($mockStmt);
        $mockStmt->method('bind_param')->willReturn(true);
        $mockStmt->method('execute')->willReturn(true);
        $mockStmt->method('store_result')->willReturn(true);
        $mockStmt->method('bind_result')->willReturnCallback(function (&$username, &$email, &$user_type, &$foto) {
            $username = 'nchile';
            $email = 'test@example.com';
            $user_type = 'monitor';
            $foto = 'foto.jpg';
        });
        $mockStmt->method('num_rows')->willReturn(1);
        $mockStmt->method('fetch')->willReturn(true);

        // Configurar los mocks para la segunda consulta
        $mockConn->method('prepare')->willReturn($mockStmt2);
        $mockStmt2->method('bind_param')->willReturn(true);
        $mockStmt2->method('execute')->willReturn(true);
        $mockStmt2->method('store_result')->willReturn(true);
        $mockStmt2->method('bind_result')->willReturnCallback(function (&$dni, &$nombre, &$apellido, &$telefono) {
            $dni = '12345678A';
            $nombre = 'Maria';
            $apellido = 'Domingo';
            $telefono = '123456789';
        });
        $mockStmt2->method('num_rows')->willReturn(1);
        $mockStmt2->method('fetch')->willReturn(true);

        // Inyectar la conexión mock en el script
        global $conn;
        $conn = $mockConn;

        // Capturar la salida del script
        ob_start();
        include __DIR__ . '/../mvc/controllers/monitor/usuario.php'; // Ajusta la ruta al script
        $output = ob_get_clean();

        // Decodificar la salida JSON
        $response = json_decode($output, true);

        // Verificar que la respuesta es correcta
        $this->assertEquals("success", $response['status']);
        $this->assertEquals("nchile", $response['usuario']['username']);
        $this->assertEquals("test@example.com", $response['usuario']['email']);
        $this->assertEquals("monitor", $response['usuario']['user_type']);
        $this->assertEquals("foto.jpg", $response['usuario']['foto']);
        $this->assertEquals("Maria", $response['monitor']['nombre']);
        $this->assertEquals("Domingo", $response['monitor']['apellido']);
        $this->assertEquals("123456789", $response['monitor']['telefono']);
    }

    public function testErrorEnBaseDeDatos()
    {
        // Simular una conexión a la base de datos (usando un mock)
        $mockConn = $this->createMock(mysqli::class);
        $mockStmt = $this->createMock(mysqli_stmt::class);

        // Configurar los mocks para la primera consulta
        $mockConn->method('prepare')->willReturn($mockStmt);
        $mockStmt->method('bind_param')->willReturn(true);
        $mockStmt->method('execute')->willReturn(true);
        $mockStmt->method('store_result')->willReturn(true);
        $mockStmt->method('num_rows')->willReturn(0); // Simular que no hay resultados

        // Inyectar la conexión mock en el script
        global $conn;
        $conn = $mockConn;

        // Capturar la salida del script
        ob_start();
        include __DIR__ . '/../mvc/controllers/monitor/usuario.php'; // Ajusta la ruta al script
        $output = ob_get_clean();

        // Decodificar la salida JSON
        $response = json_decode($output, true);

        // Verificar que la respuesta es correcta
        $this->assertEquals("error", $response['status']);
        $this->assertEquals("No se encontró información del usuario", $response['message']);
    }
}