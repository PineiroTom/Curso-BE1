import fs from 'fs';
import express from 'express';
const router = express.Router();

//Leer carritos desde el archivo
function readCartsFromFile() {
    try {
        const data = fs.readFileSync(CARTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

//Escribir carritos al archivo 
function writeCartsToFile(carts) {
    fs.writeFileSync(CARTS_FILE, JSON.stringify(carts, null, 2));
}

// Ruta POST /:cid/product/:pid para agregar producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;

    const carts = readCartsFromFile();

    const cartIndex = carts.findIndex(cart => cart.id === cid);
    if (cartIndex === -1) {
        return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }

    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex(item => item.product === pid);

    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    } 

    carts[cartIndex] = cart;
    writeCartsToFile(carts);

    res.status(200).json({mensaje: 'Producto agregado al carrito',cart});
});

export default router;