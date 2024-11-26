// Variables globales
const totalProductsElement = document.getElementById('totalProducts');
const totalValueElement = document.getElementById('totalValue');
const reportTableBody = document.querySelector('#reportTable tbody');
const exportCsvButton = document.getElementById('exportCsvButton');

// Cargar inventario desde localStorage
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

// Generar el reporte
function generateReport() {
    let totalProducts = 0;
    let totalValue = 0;

    reportTableBody.innerHTML = ''; // Limpiar tabla

    inventory.forEach((product, index) => {
        totalProducts += product.quantity;
        totalValue += product.quantity * product.price;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.price.toFixed(2)} COP</td>
            <td>${(product.quantity * product.price).toFixed(2)} COP</td>
        `;
        reportTableBody.appendChild(row);
    });

    // Actualizar totales en el DOM
    totalProductsElement.textContent = totalProducts;
    totalValueElement.textContent = `${totalValue.toFixed(2)} COP`;
}

// Exportar reporte a CSV
function exportToCsv() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Producto,Cantidad,Precio,Total\n";

    inventory.forEach((product) => {
        const total = product.quantity * product.price;
        csvContent += `${product.name},${product.quantity},${product.price.toFixed(2)},${total.toFixed(2)}\n`;
    });

    // Crear enlace de descarga
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'reporte_inventario.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Evento para exportar a CSV
exportCsvButton.addEventListener('click', exportToCsv);

// Generar el reporte al cargar la página
generateReport();
