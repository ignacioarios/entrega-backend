import {productValidation} from "../validations/Validations.js";
import {productosModel} from './models/productsModel.js'

export class ProductMongoManager {
    constructor() {
        this.products = [];

    }
    async getProducts(limit, sortOptions, queryOptions, page) {
        try {


            const result = await productosModel.paginate(
                queryOptions, { limit, sort: sortOptions, page: page, lean: true }
            );

            if (!result) {
                throw new Error('No se encontraron productos');
            }
            // Opcional: Crear un objeto con los datos paginados y propiedades adicionales
            this.productos = {
                status: result ? 'success' : 'error',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                prevLink: result.hasPrevPage === false ? null : `http://localhost:8080?limit=${limit}&page=${result.prevPage}`,
                nextLink: result.hasNextPage === false ? null : `http://localhost:8080?limit=${limit}&page=${result.nextPage}`
            }
            return this.productos;
        } catch (error) {
            console.error('ERROR AL OBTENER EL PROD:', error);
            throw error;
        }
    }
    async getProductsById(id) {
        try {
            return await productosModel.findById(id).lean()
        } catch (error) {
            console.error('ERROR AL OBTENER EL PROD:', error);
            throw error;
        }
    }
    async addProducts(title, description, code, price, status, stock, category, thumbnails = ['default.jpg']) {
        try {
            const validaciones = await productValidation(title, description, code, price, status, stock, category, thumbnails)
            if (validaciones !== true) {
                throw new Error(validaciones);
            }
            const newProduct = await productosModel.create({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails
            })
            this.products.push(newProduct.toJSON())
            return newProduct.toJSON()
        } catch (error) {
            console.error('NO SE PUEDE AGREGAR EL PRODUCTO', error)
            throw error
        }
    }
    async deleteProduct(id) {
        try {

            return await productosModel.findByIdAndDelete(id).lean()
        } catch (error) {
            console.error('ERROR AL ELIMINAR PRODUCTO:', error);
            throw error;
        }
    }
    async updateProduct(id, updateData) {
        try {
            const producto = await this.getProductsById(id);
            if (!producto) {
                throw new Error('NO HAY EXISTENCIAS DEL PRODUCTO');
            }
            delete updateData.code;
            const productoActualizado = await productosModel.findByIdAndUpdate(id, { code: producto.code, ...updateData }, { new: true, runValidators: true }).lean();
            if (!productoActualizado) {
                throw new Error('NO HAY EXISTENCIAS DEL PRODUCTO');
            }
            return productoActualizado;
        } catch (error) {
            throw new Error(`ERROR AL ACTUALIZAR: ${error.message}`);
        }
    }
}