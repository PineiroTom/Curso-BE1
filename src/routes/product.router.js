import { Router } from 'express';
import { generarNumerosAleatorios } from '../utils.js';

const router = Router();

const productos = [];

//Metodo GET para obtener los productos
router.get('/', (req,res) => {
    res.json({productos})
})

//Metodo GET para obtener producto por id
router.get('/:id', (req,res) => {
    const prodToFind = productos.find(p => p.id === req.params.id)

    if (prodToFind){
        res.status(200).json(prodToFind)
    }else
        res.status(404).json({message: 'Producto no encontrado'})
})

//Metodo POST para crear un producto
router.post('/', (req,res) => {
    const { title, description, code, price, status=true, stock, category } = req.body;
    const newProd = {
        id: generarNumerosAleatorios(),
        title,
        description,
        code,
        price,
        status,
        stock,
        category
    }
    productos.push(newProd)

    res.status(201).json({ message: 'Producto agregado exitosamente', producto: nuevoProducto });
});

router.put('/:pid', (req,res) => {
    const {id , ...camposActualizados} = req.body; //Excluyo el id del body
    
    // Busco el indice del producto
    const index = productos.find(p => p.id === req.params.id)
    
    if (index === -1){
        return res.status(404).json({message: 'Producto no encontrado'})
    }

    productos[index] = { ...productos[index], ...camposActualizados };

})

router.delete('/:pid', (req, res) => {
    const index = productos.findIndex(p => p.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    const productoEliminado = productos.splice(index, 1);  // splice devuelve un array con los elementos eliminados

    res.status(200).json({message: 'Producto eliminado exitosamente',producto: productoEliminado[0] // Devuelvo el producto eliminado
        });
});

export default router;