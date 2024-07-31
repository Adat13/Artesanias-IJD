document.addEventListener('DOMContentLoaded', function() {
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
