const validateCartId = (req, res, next) => {
    const cartId = Number(req.params.cid);
    if (isNaN(cartId)) {
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ status: "error", error: "cartId is NaN" });
    }
    req.cartId = cartId; // Guardar cartId validado para reutilizar en el controlador
    next(); // Pasar al siguiente middleware
};

const validateProductId = (req, res, next) => {
    const productId = Number(req.params.pid);
    if (isNaN(productId)) {
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ status: "error", error: "productId is NaN" });
    }
    req.productId = productId; // Guardar productId validado para reutilizar en el controlador
    next(); // Pasar al siguiente middleware
};

const validateProductData = (req, res, next) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ status: "error", error: "Missing name or price" });
    }
    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ status: "error", error: "Invalid price value" });
    }
    next(); // Si los datos son válidos, pasamos al siguiente middleware/controlador
};

const validateNewProduct = (products, title, code) => {
    // Verificar si ya existe un producto con el mismo título y código
    const productExists = products.find(p => p.title === title && p.code === code);
    if (productExists) {
        return { error: true, message: `Product ${title} with code: ${code} already exists.` };
    }
    return { error: false };
};

const validateProductFields = (productData) => {
    const { title, description, code, price, status, stock, category, thumbnails } = productData;

    if (!title || !description || !code || !price || price <= 0 || !status || stock < 0 || !category) {
        return { error: true, message: "Missing or invalid product fields" };
    }
    return { error: false };
};

const validateCartExists = (carts, idCart) => {
    const cartExists = carts.some(c => c.id === idCart);
    if (!cartExists) {
        return { error: true, message: `Cart with id ${idCart} does not exist.` };
    }
    return { error: false };
};

// Exportar todas las funciones en un solo module.exports
module.exports = {
    validateCartId,
    validateProductId,
    validateProductData,
    validateNewProduct,
    validateProductFields,
    validateCartExists,
};
