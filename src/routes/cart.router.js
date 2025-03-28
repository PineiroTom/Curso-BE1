import { Router } from 'express';
import mongoose from 'mongoose';
import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';

const router = Router();

// Metodo POST para crear un carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new CartModel({ products: [] });
        await newCart.save();

        res.status(201).json({ message: 'Carrito creado exitosamente', cart: newCart });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el carrito', error: error.message });
    }
});

// Metodo GET para obtener los prods de un carrito especifico
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findById(cid).populate('products.product');

        if (!cart) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado' });
        }

        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
    }
});

// DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await CartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        cart.products.splice(productIndex, 1);

        await cart.save();

        res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error removing product from cart', error: error.message });
    }
});

// PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({ message: 'Products must be an array' });
        }

        const cart = await CartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.products = [];

        for (const productData of products) {
            const { product: productId, quantity } = productData;

            if (!productId || !quantity) {
                return res.status(400).json({ message: 'Product ID and quantity are required' });
            }

            const product = await ProductModel.findById(productId);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            cart.products.push({ product: productId, quantity });
        }

        await cart.save();

        res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
});

// PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity) {
            return res.status(400).json({ message: 'Quantity is required' });
        }

        const cart = await CartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        cart.products[productIndex].quantity = quantity;

        await cart.save();

        res.status(200).json({ message: 'Product quantity updated successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product quantity', error: error.message });
    }
});

// DELETE api/carts/:cid deberá eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await CartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.products = [];

        await cart.save();

        res.status(200).json({ message: 'All products removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error removing products from cart', error: error.message });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findById(cid).populate('products.product');

        if (!cart) {
            return res.status(404).render('cartDetails', { mensaje: 'Carrito no encontrado' });
        }

        // Render the cart details view
        return res.render('cartDetails', { cart: cart.toObject() });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
    }
});

// POST api/carts/:cid/product/:pid deberá agregar el producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cartId = req.query.cartId;

        const cart = await CartModel.findById(cartId);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const product = await ProductModel.findById(pid);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const existingProduct = cart.products.find(item => item.product.toString() === pid);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();

        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding product to cart', error: error.message });
    }
});

export default router;