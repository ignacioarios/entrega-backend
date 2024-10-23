const express = require("express");
const ProductManager = require("../models/ProductManager");
const { validateProductId, validateProductData } = require("../validations/validations");
const error500 = require("../utils");

ProductManager.setPath("../data/products.json");

const ProductRouter = express.Router();

// Obtener todos los productos
ProductRouter.get("/", async (req, res) => {
    try {
        const products = await ProductManager.getProducts();
        res.status(200).json(products); // Devuelve los productos en formato JSON
    } catch (error) {
        error500(res, error);
    }
});

// Agregar un nuevo producto
ProductRouter.post("/", validateProductData, async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        const newProduct = await ProductManager.addProduct(title, description, code, price, status, stock, category, thumbnails);
        res.status(201).json({ status: "success", message: "Product added", product: newProduct });
    } catch (error) {
        error500(res, error);
    }
});
// Obtener un producto por ID
ProductRouter.get("/:pid", validateProductId, async (req, res) => {
    try {
        const product = await ProductManager.getProductById(req.productId); // Usamos el productId validado
        if (!product) {
            return res.status(404).json({ status: "error", error: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        error500(res, error);
    }
});

// Actualizar un producto
ProductRouter.put("/:pid", validateProductId, validateProductData, async (req, res) => {
    try {
        const updatedProduct = await ProductManager.updateProduct(req.productId, req.body); // Usamos productId y validamos datos
        res.status(200).json({ status: "success", message: "Product updated", product: updatedProduct });
    } catch (error) {
        error500(res, error);
    }
});

// Eliminar un producto
ProductRouter.delete("/:pid", validateProductId, async (req, res) => {
    try {
        await ProductManager.deleteProduct(req.productId); // Usamos el productId validado
        res.status(200).json({ status: "success", message: "Product deleted" });
    } catch (error) {
        error500(res, error);
    }
});

module.exports = ProductRouter;
