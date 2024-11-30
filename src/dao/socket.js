import { Server } from 'socket.io';
import ProductManager from './productManager.js';
import {productValidation} from '../validations/Validations.js';

const productos = new ProductManager()

const initSocket = (server) => {
    const io = new Server(server)

    io.on("connection", socket => {
        console.log('Inicio correcto')
        console.log(`NEW USER ${socket.id}`)

        socket.on('getProducts', async () => {
            try {
                const listadoDeProductos = await productos.getProducts()
                socket.emit('products', listadoDeProductos)
            } catch (error) {
                console.log(error)
            }
        })

        socket.on('addProduct', async data => {
            const { title, description, code, price, status, stock, category, thumbnails } = data
            try {
                const validaciones = await productValidation(title, description, code, Number(price), status, Number(stock), category, thumbnails)
                if (validaciones !== true) {
                    socket.emit('ERROR', validaciones);
                    return;
                }

                const producto = await productos.addProducts(title, description, code, Number(price), status, Number(stock), category, thumbnails);
                socket.emit('message', 'AGREGADO CORRECTAMENTE');
                io.emit('AÑADIDO', producto);
            } catch (error) {
                console.log('ERROR AL AÑADIR', error)
            }
        })

        socket.on('delProduct', async id => {
            try {
                const validacionProduct = await productos.getProductsById(id)
                if (!validacionProduct) {
                    socket.emit('notFound', 'NO HAY EXISTENCIA');
                    return;
                } 
                const producto = await productos.deleteProduct(id)
                producto ? socket.emit('ELIMINADO', id): socket.emit('errorDel', 'NO PUDO ELIMINARSE EL PRODUCTO')
                
            } catch (error) {
                console.log(error)
            }
        })
    })
}
export default initSocket;