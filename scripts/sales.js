// Variables globales
const totalSalesElement = document.getElementById('totalSales');
const totalRevenueElement = document.getElementById('totalRevenue');
const salesTableBody = document.querySelector('#salesTable tbody');
const exportSalesCsvButton = document.getElementById('exportSalesCsvButton');

// Cargar ventas desde localStorage
let sales = JSON.parse(localStorage.getItem('sales')) || [];

// Función para generar el reporte de ventas
function generateSalesReport() {
    let totalSales = 0;
    let totalRevenue = 0;

    // Limpiar la tabla antes de renderizar
    salesTableBody.innerHTML = '';

    // Recorrer las ventas y agregarlas a la tabla
    sales.forEach((sale, index) => {
        totalSales += sale.quantity;
        totalRevenue += sale.quantity * sale.price;

        // Crear una fila para cada venta
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${sale.productName}</td>
            <td>${sale.quantity}</td>
            <td>${sale.price.toFixed(2)} COP</td>
            <td>${(sale.quantity * sale.price).toFixed(2)} COP</td>
        `;
        salesTableBody.appendChild(row);
    });

    // Actualizar los totales en el DOM
    totalSalesElement.textContent = totalSales;
    totalRevenueElement.textContent = `${totalRevenue.toFixed(2)} COP`;
}

// Función para exportar las ventas a CSV
function exportSalesToCsv() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Producto,Cantidad Vendida,Precio Unitario,Total\n";

    sales.forEach((sale) => {
        const total = sale.quantity * sale.price;
        csvContent += `${sale.productName},${sale.quantity},${sale.price.toFixed(2)},${total.toFixed(2)}\n`;
    });

    // Crear un enlace de descarga para el CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'reporte_ventas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Evento para exportar ventas a CSV
exportSalesCsvButton.addEventListener('click', exportSalesToCsv);

// Llamada a la función para generar el reporte al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    generateSalesReport();
});
