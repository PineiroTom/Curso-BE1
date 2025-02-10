import express from 'express';
import productsRoutes from './FileSystem/fsProducts.js';
import cartsRoutes from './FileSystem/fsCarts.js';
import cartRouter from './routes/cart.router.js';
import productRouter from './routes/product.router.js';

const app = express(); //Se asocia a app el kit de herramientas de express

//Estos dos middleware analizan el cuerpo de las solicitudes
app.use(express.json());//Podemos recibir JSON al momento de recibir solicitudes 
app.use(express.urlencoded({ extended: true }));

app.use('/carts', cartsRoutes);
app.use('/products', productsRoutes);
//Inicializa el servidor 
app.listen(8080, () => {
    console.log('El servidor esta en el puerto 8080');
})

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);