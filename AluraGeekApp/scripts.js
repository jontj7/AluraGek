document.addEventListener('DOMContentLoaded', (event) => {
    loadProducts();
});

document.getElementById('productForm').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('Formulario enviado');

    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const imagenInput = document.getElementById('imagen');
    const imagen = imagenInput.files[0];

    if (!nombre || !precio || !imagen) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    if (!imagen || imagen.size === 0) {
        alert('Debes seleccionar una imagen válida.');
        return;
    }

    const maxTamanio = 5 * 1024 * 1024; // 5 MB
    if (imagen.size > maxTamanio) {
        alert(`El tamaño de la imagen no debe exceder los ${maxTamanio / (1024 * 1024)} MB.`);
        return;
    }

    convertImageToBase64(imagen)
        .then(base64Image => {
            const product = {
                nombre: nombre,
                precio: precio,
                imagen: base64Image,
                tipoImagen: imagen.type
            };

            saveProduct(product);
            displayProduct(product);
            document.getElementById('productForm').reset();
        })
        .catch(error => {
            console.error('Error al convertir la imagen a Base64:', error);
            alert('Ocurrió un error al procesar la imagen. Por favor, inténtalo de nuevo.');
        });
});

function saveProduct(product) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
}

function loadProducts() {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.forEach(product => displayProduct(product));
}

document.getElementById('limpiarBtn').addEventListener('click', function () {
    document.getElementById('productForm').reset();
});

function displayProduct(product) {
    const productDisplay = document.getElementById('productDisplay');
    const productElement = document.createElement('div');
    productElement.classList.add('product');

    const imgElement = document.createElement('img');
    imgElement.src = product.imagen;
    imgElement.alt = product.nombre;
    imgElement.style.maxWidth = '100%';
    imgElement.style.height = 'auto';

    const textElement = document.createElement('div');
    textElement.classList.add('product-info');
    textElement.innerHTML = `<strong>${product.nombre}</strong><br>Precio: $${product.precio}`;

    const actionsElement = document.createElement('div');
    actionsElement.classList.add('product-actions');

    const removeButton = document.createElement('button');
    removeButton.classList.add('product-remove');
    removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>';

    removeButton.addEventListener('click', function () {
        removeProduct(product);
        productDisplay.removeChild(productElement);
    });

    actionsElement.appendChild(removeButton);

    productElement.appendChild(imgElement);
    productElement.appendChild(textElement);
    productElement.appendChild(actionsElement);

    productDisplay.appendChild(productElement);
}

function removeProduct(product) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => p.nombre !== product.nombre);
    localStorage.setItem('products', JSON.stringify(products));
}

function convertImageToBase64(image) {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
