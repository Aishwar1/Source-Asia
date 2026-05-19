const express = require("express");

const router = express.Router();

const {
    createProduct,
    getProducts,
    getProductById,
    addMedia
} = require("../controllers/productController");

router.post("/products", createProduct);

router.get("/products", getProducts);

router.get("/products/:id", getProductById);

router.post("/products/:id/media", addMedia);

module.exports = router;