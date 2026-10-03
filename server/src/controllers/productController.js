const productService = require("../services/productService");

exports.createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body, req.user.uid);
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts(req.query.businessId);
    res.status(200).json({ products });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ product });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(
      req.params.id,
      req.body,
      req.user.uid,
    );
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id, req.user.uid);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const products = await productService.searchProducts(req.query);
    res.status(200).json({ products });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
