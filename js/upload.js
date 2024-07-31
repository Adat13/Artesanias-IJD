document.addEventListener('DOMContentLoaded', function() {
    // Manejo del envío del formulario para agregar productos
    document.getElementById('productForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío del formulario tradicional

        const form = event.target;
        const formData = new FormData(form); // Crear un FormData con los datos del formulario

        fetch('/add_product', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            document.getElementById('formStatus').textContent = result.success;
            form.reset();
            loadProducts();
        })
        .catch(error => {
            console.error('Error al subir el producto:', error);
            document.getElementById('formStatus').textContent = 'Error al subir el producto.';
        });
        
    });

});
