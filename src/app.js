import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';

//Importar routers
import viewsRouter from './routes/views.router.js';
import realTimeProductsRouter from './routes/realTimeProducts.router.js';

//Importar el constructor de servidor de sockets
import { Server } from 'socket.io';

const app = express(); // Se asocia a app el kit de herramientas de Express
const PORT = 8080;

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

// Solo prueba.
const products = [
    {
      id: 1,
      title: "Mouse Gamer RGB",
      description: "Mouse óptico con iluminación RGB y 6 botones programables.",
      code: "MOU123",
      price: 3999,
      status: "Disponible",
      stock: 25,
      category: "Periféricos"
    },
    {
      id: 2,
      title: "Teclado Mecánico",
      description: "Teclado mecánico con switches rojos y retroiluminación.",
      code: "TEC456",
      price: 7499,
      status: "Disponible",
      stock: 12,
      category: "Periféricos"
    },
    {
      id: 3,
      title: "Monitor 24'' LED",
      description: "Monitor LED Full HD con panel IPS y 75Hz.",
      code: "MON789",
      price: 24999,
      status: "Disponible",
      stock: 8,
      category: "Monitores"
    }
  ];
  
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
