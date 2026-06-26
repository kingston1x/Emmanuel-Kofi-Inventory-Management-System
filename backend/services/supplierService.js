const Supplier = require('../models/Supplier');

const getAllSuppliers = async () => {
  return await Supplier.find();
};

const getSupplierById = async (id) => {
  const supplier = await Supplier.findById(id);
  if (!supplier) throw new Error('Supplier not found');
  return supplier;
};

const createSupplier = async (data) => {
  const supplier = await Supplier.create(data);
  return supplier;
};

const updateSupplier = async (id, data) => {
  const supplier = await Supplier.findByIdAndUpdate(id, data, { new: true });
  if (!supplier) throw new Error('Supplier not found');
  return supplier;
};

const deleteSupplier = async (id) => {
  const supplier = await Supplier.findByIdAndDelete(id);
  if (!supplier) throw new Error('Supplier not found');
  return supplier;
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
};