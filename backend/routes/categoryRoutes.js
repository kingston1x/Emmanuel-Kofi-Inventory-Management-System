const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  addCategory,
  editCategory,
  removeCategory
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleCheck');

router.get('/', protect, getCategories);
router.get('/:id', protect, getCategory);
router.post('/', protect, adminOnly, addCategory);
router.put('/:id', protect, adminOnly, editCategory);
router.delete('/:id', protect, adminOnly, removeCategory);

module.exports = router;