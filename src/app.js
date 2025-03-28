import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const urlMongo = process.env.URI_MONGO; // Se conecta a la url de la base de datos en el archivo .env
const PORT = process.env.PORT; // Se conecta al puerto en el archivo .env

//Importar routers
import viewsRouter from './routes/views.router.js';
import realTimeProductsRouter from './routes/realTimeProducts.router.js';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';

//Importar el constructor de servidor de sockets
import { Server } from 'socket.io';
import { mongo } from 'mongoose';

const app = express(); // Se asocia a app el kit de herramientas de Express

mongoose.connect(urlMongo)
  .then(() => console.log("Conectado a la base de datos"))
  .catch( (error) => console.log("Error al conectar a la base de datos:"+error) );

// Middlewares para parsear JSON y datos URL-encoded (se definen una sola vez), estas analizan el cuerpo de las solicitudes.
app.use(express.json()); //Se puede recibir JSON al momento de hacer solicitudes.
app.use(express.urlencoded({ extended: true }));//Se puede enviar informacion desde la URL.

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine());
//con app.set('views', ruta) indicamos en que parte del proyecto estarán las rutas
app.set('views', __dirname + '/views');
//Finalmente con app.set('view engine','handlebars') indicamos que el motor que ya iniciamos arriba, es el que queremos utilizar
app.set('view engine', 'handlebars');

//Cargamos la carpeta 'public como nuestra carpeta de archivos estáticos
app.use(express.static(__dirname + '/public'));

app.use('/', viewsRouter);
app.use('/realtimeproducts', realTimeProductsRouter);
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter);
  
// Crear el servidor HTTP a partir de la aplicación Express

const httpServer = app.listen(PORT, () => console.log(`Servidor http escuchando en el puerto ${PORT}`));

const socketServer = new Server(httpServer);

socketServer.on('connection', socket => {
    console.log('Cliente conectado');
    
    // Escuchar mensajes enviados desde el cliente
    socket.on('message', (data) => {
        console.log(data);
    });

    socket.emit('Productos actualizados', products);
});
