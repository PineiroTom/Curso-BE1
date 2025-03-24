/** En este archivo, nosotros nos paramos como "clientes", porque representamos una vista */
const socket = io();
/**
 * io hace referencia a "socket.io", se llama así por convención.
 * La línea 1 permite instanciar el socket y guardarlo en la constante "socket"
 * Dicho socket es el que utilizaremos para poder comunicarnos con el socket del servidor
 */

socket.emit('message', "¡Hola, me estoy comunicando desde un websocket!");


socket.on('Productos actualizados', (products) => {
    const container = document.getElementById('product-list');
    container.innerHTML = "" // limpio el contenedor

    products.forEach(prod => {
        const div = document.createElement('div');
        div.className = 'producto';
        div.innerHTML = `
          <h2>${prod.title}</h2>
          <p><strong>ID:</strong> ${prod.id}</p>
          <p><strong>Descripción:</strong> ${prod.description}</p>
          <p><strong>Código:</strong> ${prod.code}</p>
          <p><strong>Precio:</strong> $${prod.price}</p>
          <p><strong>Status:</strong> ${prod.status}</p>
          <p><strong>Stock:</strong> ${prod.stock}</p>
          <p><strong>Categoría:</strong> ${prod.category}</p>
        `;
        container.appendChild(div);
      });
    });

