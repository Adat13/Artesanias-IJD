<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tienda_online";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica la conexión
if ($conn->connect_error) {
    error_log("Conexión fallida: " . $conn->connect_error); // Log de error
    die("Conexión fallida: " . $conn->connect_error);
}

// Ejecuta la consulta
$sql = "SELECT id, name, price, image FROM productos";
$result = $conn->query($sql);

// Inicializa el array de productos
$products = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    error_log("Productos recuperados: " . json_encode($products)); // Log de productos recuperados
} else {
    error_log("No se encontraron productos."); // Log si no hay productos
}

// Devuelve los productos en formato JSON
echo json_encode($products);

// Cierra la conexión
$conn->close();
?>
