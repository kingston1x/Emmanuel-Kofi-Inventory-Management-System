const express = require('express');
const router = express.Router();
const {
  getSuppliers,
  getSupplier,
  addSupplier,
  editSupplier,
  removeSupplier
} = require('../controllers/supplierController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleCheck');

router.get('/', protect, getSuppliers);
router.get('/:id', protect, getSupplier);
router.post('/', protect, adminOnly, addSupplier);
router.put('/:id', protect, adminOnly, editSupplier);
router.delete('/:id', protect, adminOnly, removeSupplier);

module.exports = router;