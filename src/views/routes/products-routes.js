// views.routes.js
import express from 'express';
import { readProductsFromFile } from '../utils/productsUtils.js'; // Función para leer productos desde productos.json
const router = express.Router();

// Ruta para mostrar la vista realTimeProducts
router.get('/realtimeproducts', (req, res) => {
  // Se asume que readProductsFromFile() retorna un array de productos
  const products = readProductsFromFile();
  res.render('realTimeProducts', { products });
});

export default router;
