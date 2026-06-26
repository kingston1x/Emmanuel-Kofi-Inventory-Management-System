const Product = require('../models/Product');

const getAllProducts = async (search) => {
  const query = search
    ? { name: { $regex: search, $options: 'i' } }
    : {};
  return await Product.find(query)
    .populate('category', 'name')
    .populate('supplier', 'name');
};

const getProductById = async (id) => {
  const product = await Product.findById(id)
    .populate('category', 'name')
    .populate('supplier', 'name');
  if (!product) throw new Error('Product not found');
  return product;
};

const createProduct = async (data) => {
  const product = await Product.create(data);
  return product;
};

const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!product) throw new Error('Product not found');
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error('Product not found');
  return product;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};