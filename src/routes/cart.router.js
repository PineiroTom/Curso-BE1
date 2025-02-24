import { Router } from 'express';
import { generarNumerosAleatorios } from '../utils.js';

const router = Router();

const carts = [];

//Metodo POST para crear un carrito
router.post('/', async (req,res) => {
    try {
        const newID =  await generarNumerosAleatorios();

        const newCart = {
            id: newID,
            products: []
        }

        carts.push(newCart);

        res.status(201).json({message: 'Carrito creado exitosamente', cart:newCart})
    }
    catch (error) {
        res.status(500).json({message: 'Error al crear el carrito', error:error.message})
    }
});

//Metodo GET para obtener los prods de un carrito especifico 
router.get('/:cid', (req,res) => {
    const cart = carts.find(cart => cart.id === req.params.cid)

    //Si el carrito no existe...
    if (!cart) {
        return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }
    //Si el carrito existes muestro los productos
    res.status(200).json({ products: cart.products });
})

router.post('/:cid/product/:pid', (req, res) => {
    //Se obtienen los ids del cart y del product
    const cid = req.params.cid;
    const pid = req.params.pid;

    //Se busca el carrito
    const cart = carts.find(cart => cart.id === cid);
    if (!cart) {
        return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }

    //Se busca si existe el producto en el carrito
    const productInCart = cart.products.find(item => item.product === pid);

    if (productInCart) {
        // Si el producto ya está en el carrito, incrementamos su cantidad en 1
        productInCart.quantity += 1;
    } else {
        // Si no existe, lo agregamos con una cantidad inicial de 1
        cart.products.push({ product: pid, quantity: 1 });
    }
    
    res.status(200).json({
        mensaje: 'Producto agregado al carrito',
        cart
    });
})


export default router;