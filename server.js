const express = require('express');
const app = express();

app.use(express.json());

// Serve simple frontend
app.get('/', (req, res) => {
    res.send(`
    <h1>Retail System Demo</h1>
    
    <h3>Products</h3>
    <button onclick="getProducts()">Load Products</button>
    <pre id="products"></pre>

    <h3>Place Order</h3>
    Product ID: <input id="pid"><br>
    Quantity: <input id="qty"><br>
    <button onclick="placeOrder()">Order</button>
    <pre id="order"></pre>

    <script>
    async function getProducts() {
        let res = await fetch('/products');
        let data = await res.json();
        document.getElementById('products').innerText = JSON.stringify(data, null, 2);
    }

    async function placeOrder() {
        let productId = document.getElementById('pid').value;
        let quantity = document.getElementById('qty').value;

        let res = await fetch('/order', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({productId: Number(productId), quantity: Number(quantity)})
        });

        let data = await res.json();
        document.getElementById('order').innerText = JSON.stringify(data, null, 2);
    }
    </script>
    `);
});

// Data
let products = [
    { id: 1, name: "Laptop", price: 1000, stock: 5 },
    { id: 2, name: "Phone", price: 500, stock: 10 }
];

let orders = [];

// Get products
app.get('/products', (req, res) => {
    res.json(products);
});

// Place order
app.post('/order', (req, res) => {
    const { productId, quantity } = req.body;

    let product = products.find(p => p.id === productId);

    if (!product) {
        return res.json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
        return res.json({ message: "Not enough stock" });
    }

    product.stock -= quantity;

    let order = {
        id: orders.length + 1,
        productId,
        quantity,
        status: "Processing"
    };

    orders.push(order);

    res.json(order);
});

// Start server
app.listen(3000, () => {
    console.log("Running on port 3000");
});
