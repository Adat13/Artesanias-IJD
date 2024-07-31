document.addEventListener('DOMContentLoaded', function() {
    // Manejo del envío del formulario para agregar productos
    document.getElementById('productForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío del formulario tradicional

        const form = event.target;
        const formData = new FormData(form); // Crear un FormData con los datos del formulario

        fetch('/add_product', { // Asegúrate de que la ruta coincida con la de tu servidor
            method: 'POST',
            body: formData
        })
        .then(response => response.json()) // Cambia a .json() si el servidor responde con JSON
        .then(result => {
            document.getElementById('formStatus').textContent = result; // Mostrar el resultado
            form.reset(); // Limpiar el formulario después de la carga
            loadProducts(); // Recargar los productos para mostrar el nuevo producto
        })
        .catch(error => {
            console.error('Error al subir el producto:', error);
            document.getElementById('formStatus').textContent = 'Error al subir el producto.';
        });
    });

    // Cargar los productos al cargar la página
    loadProducts();
});

function loadProducts() {
    fetch('/get_products') // Asegúrate de que la ruta coincida con la de tu servidor
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }
            return response.json();
        })
        .then(products => {
            console.log("Productos recibidos:", products); // Log de productos recibidos
            const productContainer = document.querySelector('.product-container');
            productContainer.innerHTML = ''; // Limpia el contenedor
            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');

                // Crear una URL para la imagen usando Blob
                const imageUrl = `/get_image/${product.id}`;
                fetch(imageUrl)
                    .then(response => response.blob())
                    .then(blob => {
                        const imageObjectUrl = URL.createObjectURL(blob);
                        productElement.innerHTML = `
                            <img src="${imageObjectUrl}" alt="${product.name}">
                            <h2>${product.name}</h2>
                            <p>$${product.price}</p>
                        `;
                        productContainer.appendChild(productElement); // Agrega el producto al contenedor
                    })
                    .catch(error => {
                        console.error('Error al cargar la imagen:', error); // Log de error
                    });
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error); // Log de error
        });
}

// Verificación de conexión
document.getElementById('checkConnectionBtn').addEventListener('click', function() {
    fetch('/check_connection')
        .then(response => {
            if (response.ok) {
                return response.text(); // O json() si el servidor responde con JSON
            } else {
                throw new Error('No se pudo conectar');
            }
        })
        .then(message => {
            document.getElementById('connectionStatus').textContent = `Conexión exitosa: ${message}`;
        })
        .catch(error => {
            document.getElementById('connectionStatus').textContent = `Error: ${error.message}`;
        });
});
