const fs = require('fs').promises;
const { validateNewProduct, validateProductFields } = require("../validations/validations");

class ProductManager {
    static #products = [];
    static #path = "";

    static setPath(path) {
        this.#path = path;
    }

    static async addProduct(title, description, code, price, status, stock, category, thumbnails) {
        try {
            await this.#checkFileExistsAndLoad();

            // Validar si el producto ya existe
            const validation = validateNewProduct(this.#products, title, code);
            if (validation.error) {
                console.error(validation.message);
                return;
            }

            // Validar los campos del producto
            const fieldValidation = validateProductFields({ title, description, code, price, status, stock, category, thumbnails });
            if (fieldValidation.error) {
                console.error(fieldValidation.message);
                return;
            }

            let id = 1;
            if (this.#products.length !== 0)
                id = Math.max(...this.#products.map(p => p.id)) + 1;

            let newProduct = {
                id: id,
                title: title,
                description: description,
                code: code,
                price: price,
                status: status,
                stock: stock,
                category: category,
                thumbnails: thumbnails
            };

            console.log(newProduct);
            this.#products.push(newProduct);
            await this.#updateFile();
            console.log(`Product ${title} saved.`);
        } catch (error) {
            console.error(`Error adding product: ${error}`);
        }
    }

    static async getProducts() {
        await this.#checkFileExistsAndLoad();
        return this.#products;
    }

    static async getProductById(id) {
        await this.#checkFileExistsAndLoad();
        let productDb = this.#products.find(p => p.id === id);
        if (!productDb) {
            console.error(`Product ${id} not found.`);
            return;
        }
        return productDb;
    }

    static async getProduct(title, code) {
        await this.#checkFileExistsAndLoad();
        let productDb = this.#products.find(p => p.title === title && p.code === code);
        return productDb;
    }

    static async updateProduct(id, title, description, code, price, status, stock, category, thumbnails) {
        await this.#checkFileExistsAndLoad();

        // Asegúrate de que el id sea un número
        id = Number(id); // Convertir a número si es necesario

        let product = this.#products.find(p => p.id === id);
        if (!product) {
            console.error(`Product ${id} not found.`);
            return { error: `Product ${id} not found.` }; // Retornar un objeto de error
        }

        // Actualizar solo los campos que fueron proporcionados
        if (title !== undefined) product.title = title;
        if (description !== undefined) product.description = description;
        if (code !== undefined) product.code = code;
        if (price !== undefined) product.price = price;
        if (status !== undefined) product.status = status;
        if (stock !== undefined) product.stock = stock;
        if (category !== undefined) product.category = category;
        if (thumbnails !== undefined) product.thumbnails = thumbnails;

        await this.#updateFile();
        console.log(`Product ${id} updated.`);

        return product; // Retornar el producto actualizado
    }

    static async deleteProduct(id) {
        await this.#checkFileExistsAndLoad();
        this.#products = this.#products.filter(product => product.id !== id);
        await this.#updateFile();
        console.log(`Product ${id} deleted.`);
    }

    static async #updateFile() {
        try {
            console.log("Saving products:", this.#products); // Ver los productos antes de guardar
            await fs.writeFile(this.#path, JSON.stringify(this.#products, null, 2));
        } catch (error) {
            console.error(`Error updating file: ${error}`);
        }
    }
    

    static async #readFile() {
        try {
            let file = await fs.readFile(this.#path, { encoding: 'utf-8' });
            if (file) {
                this.#products = JSON.parse(file);
            }
        } catch (error) {
            console.error(`Error reading file: ${error}`);
        }
    }

    static async #checkFileExistsAndLoad() {
        try {
            await fs.access(this.#path);
            await this.#readFile();
        } catch (error) {
            console.error(`File at path "${this.#path}" does not exist: ${error}`);
        }
    }
}

module.exports = ProductManager;
