import fs from 'fs';
import router from '../routes/cart.router.js';



function readProductsFromFile() {
    try {
        const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

    function writeProductsToFile(products) {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));}

    router.get('/:pid', (req, res) => {
        const pid = req.params.pid;
        const products = readProductsFromFile();
        const product = products.find(p => p.id == pid); // Uso de == para permitir comparar string y number
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(product);});


    router.post('/', (req, res) => {
        const { title, description, code, price, status, stock, category } = req.body;
    
    if (!title || !description || !code || price === undefined || status === undefined || stock === undefined || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios: title, description, code, price, status, stock, category.'});
    }
    
    const products = readProductsFromFile();
    // Generar un id único: se toma el id del último producto y se le suma 1 (o se inicia en 1)
    const newId = products.length > 0 ? Number(products[products.length - 1].id) + 1 : 1;
    
    const newProduct = {
        id: newId,
        title,
        description,
        code,
        price,
        status,
        stock,
        category
    };

    products.push(newProduct);
    writeProductsToFile(products);
    
    res.status(201).json({ message: 'Producto agregado exitosamente', product: newProduct });
    });


    router.put('/:pid', (req, res) => {
    const pid = req.params.pid;
    const { id, ...fieldsToUpdate } = req.body; // Se ignora el id enviado en el body, si es que llega

    const products = readProductsFromFile();
    const index = products.findIndex(p => p.id == pid);

    if (index === -1) {  return res.status(404).json({ message: 'Producto no encontrado' });
    }

    products[index] = { ...products[index], ...fieldsToUpdate };
    writeProductsToFile(products);

    res.status(200).json({ message: 'Producto actualizado exitosamente', product: products[index] });
});

    router.delete('/:pid', (req, res) => {
        const pid = req.params.pid;
        const products = readProductsFromFile();
        const index = products.findIndex(p => p.id == pid);


    if (index === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const deletedProduct = products.splice(index, 1)[0];
    writeProductsToFile(products);

    res.status(200).json({ message: 'Producto eliminado exitosamente', product: deletedProduct });
});

export default router;