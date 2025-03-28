import { Router } from 'express';

const router = Router();
import CartModel from '../models/cart.model.js';

router.get('/', async (req, res) => {
    let cartId;

    if (req.query.cartId) {
        cartId = req.query.cartId;
    } else {
        const newCart = new CartModel({ products: [] });
        await newCart.save();
        cartId = newCart._id;
    }

    res.render('index', { cartId: cartId });
})

export default router;