const express = require("express");
const CartManager = require("../models/CartManager");
const ProductManager = require("../models/ProductManager");
const { validateCartId, validateProductId } = require("../validations/CartValidations");
const error500 = require("../utils");

CartManager.setPath("./data/carts.json");
ProductManager.setPath("./data/products.json");

const CartRouter = express.Router();

CartRouter.post("/", async (req, res) => {
    let idCart = await CartManager.newCart();
    res.setHeader('Content-type', 'application/json');
    res.status(201).json({ status: "success", message: `Create Cart ${idCart}` });
});

CartRouter.get("/:cid", validateCartId, async (req, res) => {
    try {
        const cart = await CartManager.getCartById(req.cartId); // Usamos el cartId validado
        if (!cart) {
            res.setHeader('Content-type', 'application-json');
            return res.status(404).json({ status: "error", error: "Cart not found" });
        }
        res.status(200).json(cart.products);
    } catch (error) {
        error500(res, error);
    }
});

CartRouter.post("/:cid/product/:pid", validateCartId, validateProductId, async (req, res) => {
    try {
        await CartManager.addProduct(req.cartId, req.productId); // Usamos cartId y productId validados
        return res.status(200).json({ status: "success", message: "product added" });
    } catch (error) {
        res.setHeader('Content-type', 'application-json');
        return res.status(500).json({ status: "error", error: "error to add product" });
    }
});

module.exports = CartRouter;