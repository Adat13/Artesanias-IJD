<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "artesanias_ijd";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener datos del formulario
$name = $_POST['name'];
$price = $_POST['price'];
$image = $_FILES['image']['name'];
$imageTmpName = $_FILES['image']['tmp_name'];
$imageSize = $_FILES['image']['size'];
$imageError = $_FILES['image']['error'];
$imageType = $_FILES['image']['type'];

// Validar imagen
if ($imageError === 0) {
    $imageExt = strtolower(pathinfo($image, PATHINFO_EXTENSION));
    $allowedExt = array('jpg', 'jpeg', 'png');

    if (in_array($imageExt, $allowedExt)) {
        if ($imageSize < 5000000) { // Máximo 5MB
            $newImageName = uniqid('', true) . "." . $imageExt;
            $imageDestination = 'uploads/' . $newImageName;
            move_uploaded_file($imageTmpName, $imageDestination);

            // Insertar datos en la base de datos
            $sql = "INSERT INTO products (name, price, image) VALUES ('$name', '$price', '$newImageName')";
            if ($conn->query($sql) === TRUE) {
                echo "Producto agregado exitosamente.";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        } else {
            echo "El archivo es demasiado grande.";
        }
    } else {
        echo "Tipo de archivo no permitido.";
    }
} else {
    echo "Hubo un error al subir la imagen.";
}

$conn->close();
?>
