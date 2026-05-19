const { products } = require("../storage/memoryStore");

const { v4: uuidv4 } = require("uuid");

const MAX_URLS = 20;

const isValidUrl = (url) => {
    try {

        const parsed = new URL(url);

        return (
            (parsed.protocol === "http:" ||
             parsed.protocol === "https:") &&
             url.length <= 2048
        );

    } catch {
        return false;
    }
};

const validateUrls = (urls = []) => {

    if (!Array.isArray(urls)) {
        return false;
    }

    if (urls.length > MAX_URLS) {
        return false;
    }

    for (const url of urls) {

        if (!isValidUrl(url)) {
            return false;
        }
    }

    return true;
};

const createProduct = (req, res) => {

    const {
        name,
        sku,
        image_urls = [],
        video_urls = []
    } = req.body;

    if (
        !name ||
        !sku ||
        name.trim() === "" ||
        sku.trim() === ""
    ) {

        return res.status(400).json({
            message: "Name and SKU are required"
        });
    }

    for (const product of products.values()) {

        if (product.sku === sku) {

            return res.status(409).json({
                message: "SKU already exists"
            });
        }
    }

    if (
        !validateUrls(image_urls) ||
        !validateUrls(video_urls)
    ) {

        return res.status(400).json({
            message: "Invalid URLs"
        });
    }

    const id = uuidv4();

    const product = {
        id,
        name,
        sku,
        image_urls,
        video_urls,
        created_at: new Date()
    };

    products.set(id, product);

    return res.status(201).json(product);
};

const getProducts = (req, res) => {

    let { limit = 10, offset = 0 } = req.query;

    limit = parseInt(limit);
    offset = parseInt(offset);

    if (isNaN(limit) || limit < 1) {
        limit = 10;
    }

    if (isNaN(offset) || offset < 0) {
        offset = 0;
    }

    if (limit > 50) {
        limit = 50;
    }

    const allProducts = Array.from(products.values());

    const paginatedProducts =
        allProducts.slice(offset, offset + limit);

    const response = paginatedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        image_count: product.image_urls.length,
        video_count: product.video_urls.length,
        thumbnail_url: product.image_urls[0] || null,
        created_at: product.created_at
    }));

    return res.status(200).json(response);
};

const getProductById = (req, res) => {

    const { id } = req.params;

    if (!products.has(id)) {

        return res.status(404).json({
            message: "Product not found"
        });
    }

    return res.status(200).json(
        products.get(id)
    );
};

const addMedia = (req, res) => {

    const { id } = req.params;

    const {
        image_urls = [],
        video_urls = []
    } = req.body;

    if (
        image_urls.length === 0 &&
        video_urls.length === 0
    ) {

        return res.status(400).json({
            message: "At least one media URL required"
        });
    }

    if (!products.has(id)) {

        return res.status(404).json({
            message: "Product not found"
        });
    }

    if (
        !validateUrls(image_urls) ||
        !validateUrls(video_urls)
    ) {

        return res.status(400).json({
            message: "Invalid URLs"
        });
    }

    const product = products.get(id);

    product.image_urls.push(...image_urls);

    product.video_urls.push(...video_urls);

    return res.status(200).json(product);
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    addMedia
};