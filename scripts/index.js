// Variables globales
const productTableBody = document.querySelector('#productTable tbody');
const addProductForm = document.getElementById('addProductForm');
const editProductForm = document.getElementById('editProductForm');
const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));

// Cargar inventario desde localStorage
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

// Verificar que los productos se cargan correctamente
console.log(inventory);

// Renderizar inventario en la tabla
function renderInventory() {
    productTableBody.innerHTML = ''; // Limpiar la tabla

    inventory.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${product.image}" alt="${product.name}" class="img-thumbnail" style="width: 50px; height: 50px;"></td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.price.toFixed(2)} COP</td>
            <td>${(product.quantity * product.price).toFixed(2)} COP</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="openEditModal(${index})">Editar</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}


// Abrir modal para editar un producto
function openEditModal(index) {
    const product = inventory[index];
    document.getElementById('editProductIndex').value = index;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductQuantity').value = product.quantity;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductImage').value = '';
    editProductModal.show();
}

// Guardar cambios al editar un producto
editProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const index = document.getElementById('editProductIndex').value;
    const name = document.getElementById('editProductName').value;
    const quantity = parseInt(document.getElementById('editProductQuantity').value, 10);
    const price = parseFloat(document.getElementById('editProductPrice').value);
    const imageInput = document.getElementById('editProductImage');
    const image = imageInput.files[0]
        ? URL.createObjectURL(imageInput.files[0])
        : inventory[index].image;

    inventory[index] = { name, quantity, price, image };
    localStorage.setItem('inventory', JSON.stringify(inventory));
    renderInventory();
    editProductModal.hide();
});

addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener los datos del formulario
    const name = document.getElementById('productName').value;
    const quantity = parseInt(document.getElementById('productQuantity').value, 10);
    const price = parseFloat(document.getElementById('productPrice').value);
    const imageInput = document.getElementById('productImage');
    
    // Convertir imagen a Base64
    const image = await readFileAsDataURL(imageInput.files[0]);

    // Crear un nuevo producto
    const newProduct = { name, quantity, price, image };

    // Agregarlo al inventario y guardar en localStorage
    inventory.push(newProduct);
    localStorage.setItem('inventory', JSON.stringify(inventory));

    // Renderizar nuevamente la tabla y resetear el formulario
    renderInventory();
    addProductForm.reset();
    const addProductModal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    addProductModal.hide();
});

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject('Error al leer el archivo');
        reader.readAsDataURL(file);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    renderInventory();
});

