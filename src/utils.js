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