const apiUrl = "http://127.0.0.1:8000/api/products/"; // Cambia esto si tu API tiene otra URL base

// Obtener y renderizar productos
async function fetchProducts() {
    const response = await fetch(apiUrl);
    const products = await response.json();
    renderProducts(products);
}

function renderProducts(products) {
    const productTableBody = document.querySelector("#product-table tbody");
    productTableBody.innerHTML = "";

    products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" value="${product.name}" data-original="${product.name}" class="editable" /></td>
            <td><input type="text" value="${product.description || ''}" data-original="${product.description || ''}" class="editable" /></td>
            <td><input type="number" value="${product.price}" data-original="${product.price}" class="editable" /></td>
            <td><input type="number" value="${product.quantity}" data-original="${product.quantity}" class="editable" /></td>
            <td>
                <button class="save" onclick="saveProduct(${product.id}, this)">Guardar</button>
                <button class="cancel" onclick="cancelEdit(this)">Cancelar</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

// Guardar cambios en un producto
async function saveProduct(id, button) {
    const row = button.closest("tr");
    const inputs = row.querySelectorAll(".editable");
    const updatedProduct = {
        name: inputs[0].value,
        description: inputs[1].value,
        price: parseFloat(inputs[2].value),
        quantity: parseInt(inputs[3].value),
    };

    // Validar cambios
    if (!updatedProduct.name || isNaN(updatedProduct.price) || isNaN(updatedProduct.quantity)) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    // Enviar datos al backend
    const response = await fetch(`${apiUrl}${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
    });

    if (response.ok) {
        alert("Producto actualizado con éxito.");
        fetchProducts(); // Actualizar la lista de productos
    } else {
        alert("Error al actualizar el producto.");
    }
}

// Cancelar edición
function cancelEdit(button) {
    const row = button.closest("tr");
    const inputs = row.querySelectorAll(".editable");
    inputs.forEach(input => {
        input.value = input.getAttribute("data-original"); // Restaurar valor original
    });
}


// Agregar un producto
document.getElementById("add-product").addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const quantity = document.getElementById("quantity").value;

    if (!name || !price || !quantity) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
    }

    const newProduct = { name, description, price, quantity };
    await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
    });
    fetchProducts();
});

// Editar un producto
async function editProduct(id) {
    const name = prompt("Nuevo nombre:");
    const description = prompt("Nueva descripción:");
    const price = prompt("Nuevo precio:");
    const quantity = prompt("Nueva cantidad:");

    if (!name || !price || !quantity) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
    }

    const updatedProduct = { name, description, price, quantity };
    await fetch(`${apiUrl}${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
    });
    fetchProducts();
}

// Eliminar un producto
async function deleteProduct(id) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
        await fetch(`${apiUrl}${id}/`, { method: "DELETE" });
        fetchProducts();
    }
}

// Inicializar la aplicación
fetchProducts();
