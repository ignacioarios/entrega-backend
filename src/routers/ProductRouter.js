const express = require("express");
const ProductManager = require("../models/ProductManager");
const { validateProductId, validateProductData } = require("../validations/validations");
const error500 = require("../utils");

ProductManager.setPath("./data/products.json");

const ProductRouter = express.Router();

ProductRouter.post("/", validateProductData, async (req, res) => {
    try {
        const newProduct = await ProductManager.addProduct(req.body);
        res.status(201).json({ status: "success", message: "Product added", product: newProduct });
    } catch (error) {
        error500(res, error);
    }
});

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

ProductRouter.put("/:pid", validateProductId, validateProductData, async (req, res) => {
    try {
        const updatedProduct = await ProductManager.updateProduct(req.productId, req.body); // Usamos productId y validamos datos
        res.status(200).json({ status: "success", message: "Product updated", product: updatedProduct });
    } catch (error) {
        error500(res, error);
    }
});

ProductRouter.delete("/:pid", validateProductId, async (req, res) => {
    try {
        await ProductManager.deleteProduct(req.productId); // Usamos el productId validado
        res.status(200).json({ status: "success", message: "Product deleted" });
    } catch (error) {
        error500(res, error);
    }
});

module.exports = ProductRouter;