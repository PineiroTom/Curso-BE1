//Nos crea una variable __dirname que nos da la RUTA de nuestro archivo app.js
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;


//funcion para generar un numero aleatorio
const generarUnNumeroAleatorio = (min,max) => Math.floor(Math.random() * (max-min+1)) + 1;

export const generarNumerosAleatorios = cantidad => {
    return new Promise((resolve, reject) => {
        let numeros = [];
        for(let i=0; i < cantidad; i++){
            numeros.push(generarUnNumeroAleatorio(1,20));
        }
        resolve(numeros);
    })
}

