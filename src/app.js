import express from 'express';
import { engine } from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRoutes from './FileSystem/fsProducts.js';
import cartsRoutes from './FileSystem/fsCarts.js';
import cartRouter from './routes/cart.router.js';
import productRouter from './routes/product.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // Se asocia a app el kit de herramientas de Express
const PORT = 8080;

// Middlewares para parsear JSON y datos URL-encoded (se definen una sola vez)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas de FileSystem (productos y carritos)
app.use('/carts', cartsRoutes);
app.use('/products', productsRoutes);

// Rutas de API (con routers separados)
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Ruta para renderizar la vista "home.handlebars"
app.get('/', (req, res) => {
    res.render('home', { title: 'Servidor con Handlebars y Socket.IO' });
});

// Ruta para renderizar la vista "realTimeProducts.handlebars"
// Esta vista se actualizará mediante WebSockets
app.get('/realtimeproducts', (req, res) => {
    // En una implementación real, aquí deberías pasar la lista actual de productos.
    // Por ejemplo, podrías obtenerla de una variable en memoria o de la FS.
    res.render('realTimeProducts', { products: [] });
});

// Crear el servidor HTTP a partir de la aplicación Express
const server = http.createServer(app);

// Configurar Socket.IO sobre el servidor HTTP
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Enviar mensaje de bienvenida al cliente
    socket.emit('mensaje', { text: 'Bienvenido al servidor de Socket.IO' });
    
    // Escuchar mensajes enviados desde el cliente
    socket.on('mensaje', (data) => {
        console.log('Mensaje recibido del cliente:', data);
        // Reenviar el mensaje a todos los clientes conectados
        io.emit('mensaje', data);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
