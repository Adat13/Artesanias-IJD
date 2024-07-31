CREATE DATABASE tienda_online;
USE tienda_online;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255) NOT NULL
);

INSERT INTO productos (name, price, image) VALUES
('Producto 1', 19.99, 'img/imgprueba.jpg'),
('Producto 2', 29.99, 'img/product2.jpg'),
('Producto 3', 39.99, 'img/product3.jpg');
