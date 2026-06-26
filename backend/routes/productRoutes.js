const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleCheck');

router.get('/', protect, getProducts);
router.get('/:id', protect, getProduct);
router.post('/', protect, adminOnly, addProduct);
router.put('/:id', protect, adminOnly, editProduct);
router.delete('/:id', protect, adminOnly, removeProduct);

module.exports = router;