const Product = require("../models/product");//อ้างอิงpath

exports.getProduct = async (req, res) => {//funtion แสดงค่าทั้งหมด
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProductID = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.postProduct = async (req, res) => {
    try {
        const { product_name, product_type, price, unit } = req.body;

        const product = new Product({ product_name, product_type, price, unit });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        const update = req.body;
        Object.assign(product, update);
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await Product.findByIdAndDelete(id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
