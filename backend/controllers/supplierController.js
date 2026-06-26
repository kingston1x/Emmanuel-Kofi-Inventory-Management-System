const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../services/supplierService');

const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await getAllSuppliers();
    res.json(suppliers);
  } catch (error) {
    next(error);
  }
};

const getSupplier = async (req, res, next) => {
  try {
    const supplier = await getSupplierById(req.params.id);
    res.json(supplier);
  } catch (error) {
    next(error);
  }
};

const addSupplier = async (req, res, next) => {
  try {
    const supplier = await createSupplier(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
};

const editSupplier = async (req, res, next) => {
  try {
    const supplier = await updateSupplier(req.params.id, req.body);
    res.json(supplier);
  } catch (error) {
    next(error);
  }
};

const removeSupplier = async (req, res, next) => {
  try {
    await deleteSupplier(req.params.id);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSuppliers, getSupplier, addSupplier, editSupplier, removeSupplier };