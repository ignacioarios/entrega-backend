import { ProductMongoManager as ProductManager } from "../dao/ProductMongoManager.js";



export const productValidation = async (title, description, code, price, status, stock, category, thumbnails) => {
    const productos = new ProductManager();

    try {
        const data = await productos.getProducts();
        const productoExistente = data.payload.find(p => p.code === code);


        
        if (!title || !description || !code || !price || status === undefined || !stock || !category || !thumbnails) {
            throw new Error('Todos los campos son obligatorios');
        }


        if (typeof title !== 'string' || typeof description !== 'string' || typeof code !== 'string' || typeof category !== 'string') {
            throw new Error('title code y description str');
        }

        if (typeof price !== 'number' || typeof stock !== 'number') {
            throw new Error('price y stock deben ser de tipo number');
        }

        if (typeof status !== 'boolean') {
            throw new Error('status = boolean');
        }

        if (price <= 0 || stock <= 0) {
            throw new Error('debn ser >0');
        }

        if (thumbnails && (!Array.isArray(thumbnails) || !thumbnails.every(item => typeof item === 'string'))) {
            throw new Error('debe ser unicamente str');
        }

        if (productoExistente) {
            throw new Error('Ya tenemos existencias de este producto.');
        }

        return true;
    } catch (error) {
        throw new Error(error.message); 
    }
};


export const cartsValidation = async (id, productId, quantity) => {
    const productos = new ProductManager();

    try {

        
        const producto = await productos.getProductsById(productId);
        if (!producto) {
            throw new Error('El producto que intentas añadir no existe');
        }


        
        if (!productId || !quantity || !id) {
            throw new Error('Todos los campos son obligatorios');
        }


        
        if (typeof id !== 'string' || typeof productId !== 'string' || typeof quantity !== 'number') {
            throw new Error('id y productId deben ser strings; quantity debe ser un número');
        }


        
        if (quantity <= 0) {
            throw new Error('quantity debe ser mayor a 0');
        }

        return true; 
        
    } catch (error) {
        throw new Error(error.message); 
        
    }
};
