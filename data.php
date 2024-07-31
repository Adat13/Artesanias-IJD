<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tienda_online";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    error_log("Conexión fallida: " . $conn->connect_error);
    die("Conexión fallida: " . $conn->connect_error);
}

$sql = "SELECT id, name, price, image FROM productos";
$result = $conn->query($sql);

$products = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    error_log("Productos recuperados: " . json_encode($products));
} else {
    error_log("No se encontraron productos.");
}

echo json_encode($products);
$conn->close();
?>
