// Variables globales
const productTableBody = document.querySelector('#productTable tbody');
const sellProductModal = new bootstrap.Modal(document.getElementById('sellModal'));
const sellQuantityInput = document.getElementById('sellQuantity');
const productIndexInput = document.getElementById('productIndex');

// Cargar inventario desde localStorage
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

// Verificar que los productos se cargan correctamente
console.log(inventory);

// Renderizar inventario en la tabla
function renderInventory() {
    productTableBody.innerHTML = '';  // Limpiar la tabla antes de volver a llenarla
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
                <button class="btn btn-success btn-sm" onclick="openSellModal(${index})">Vender</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

// Abrir modal para vender un producto
function openSellModal(index) {
    const product = inventory[index];
    productIndexInput.value = index; // Guardar el índice del producto seleccionado
    sellQuantityInput.value = '';  // Limpiar la cantidad en el input
    sellProductModal.show();  // Mostrar el modal
}

// Manejar la venta de producto y guardar en ventas
document.getElementById('sellProductBtn').addEventListener('click', () => {
    const index = parseInt(productIndexInput.value, 10);
    const quantityToSell = parseInt(sellQuantityInput.value, 10);

    // Verificar si la cantidad a vender es válida
    if (quantityToSell > 0 && quantityToSell <= inventory[index].quantity) {
        // Reducir la cantidad del producto
        inventory[index].quantity -= quantityToSell;

        // Si la cantidad llega a 0, eliminar el producto
        if (inventory[index].quantity === 0) {
            inventory.splice(index, 1);
        }

        // Crear el objeto de la venta
        const sale = {
            productName: inventory[index].name,
            quantity: quantityToSell,
            price: inventory[index].price
        };

        // Guardar la venta en el array de ventas
        let sales = JSON.parse(localStorage.getItem('sales')) || [];
        sales.push(sale);

        // Actualizar localStorage con las ventas
        localStorage.setItem('sales', JSON.stringify(sales));

        // Actualizar inventario en localStorage
        localStorage.setItem('inventory', JSON.stringify(inventory));

        // Volver a renderizar la tabla de inventario
        renderInventory();

        // Generar el reporte de ventas
        generateSalesReport();

        // Cerrar el modal después de realizar la venta
        sellProductModal.hide();
    } else {
        // Mostrar el mensaje de error si la cantidad es inválida
        alert('Cantidad inválida. Asegúrate de que no exceda el inventario disponible.');

        // Cerrar el modal también en caso de error
        sellProductModal.hide();
    }
});



// Renderizar el inventario al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    renderInventory();  // Llenar la tabla con los productos
});
