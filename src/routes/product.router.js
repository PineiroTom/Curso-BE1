import { Router } from 'express';
import mongoose from 'mongoose';
import ProductModel from '../models/product.model.js';

const router = Router();

//Metodo GET para obtener los productos
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query, category, availability } = req.query;

        const options = {
            limit: parseInt(limit),
            skip: (page - 1) * limit,
        };

        if (sort === 'asc') {
            options.sort = { price: 1 };
        } else if (sort === 'desc') {
            options.sort = { price: -1 };
        }

        let filter = {};
        if (query) {
            filter = { $text: { $search: query } };
        }
        if (category) {
            filter.category = category;
        }
        if (availability) {
            filter.availability = availability;
        }

        const totalProducts = await ProductModel.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? parseInt(page) + 1 : null;

        const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}&category=${category}&availability=${availability}` : null;
        const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}&category=${category}&availability=${availability}` : null;

        const productos = await ProductModel.find(filter, null, options);

        const response = {
            status: 'success',
            payload: productos,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: parseInt(page),
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink,
        };

        res.render('index', response);
            } catch (error) {
                console.error("Error al obtener los productos:", error);
                res.status(500).json({ status: 'error', error: "Error al obtener los productos" });
            }
        });

//Metodo GET para obtener producto por id
router.get('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const prodToFind = await ProductModel.findById(id);

        if (prodToFind){
            res.status(200).json(prodToFind)
        }else{
            res.status(404).json({message: 'Producto no encontrado'})
        }
    } catch (error) {
        console.error("Error al obtener el producto por ID:", error);
        res.status(500).json({ error: "Error al obtener el producto por ID" });
    }
})

//Metodo POST para crear un producto
router.post('/', async (req,res) => {
    try {
        const { title, description, code, price, status=true, stock, category } = req.body;
        const newProd = new ProductModel({
            title,
            description,
            code,
            price,
            status,
            stock,
            category
        });
        await newProd.save();

        res.status(201).json({ message: 'Producto agregado exitosamente', producto: newProd });
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({ error: "Error al crear el producto" });
    }
});

router.put('/:pid', async (req,res) => {
    try {
        const product = await ProductModel.findOne({pid: req.params.pid});

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto actualizado exitosamente', producto: product });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }

})

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await ProductModel.findByIdAndDelete(pid);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado exitosamente', producto: product });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

// ruta para mostrar los detalles de un prod
router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductModel.findById(pid);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.render('productDetails', { product });
  } catch (error) {
    console.error("Error al obtener el producto por ID:", error);
    res.status(500).json({ error: "Error al obtener el producto por ID" });
  }
});

export default router;