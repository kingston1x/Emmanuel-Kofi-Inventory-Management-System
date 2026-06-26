const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/authController')
const { protect } = require('../middleware/auth')
const { adminOnly } = require('../middleware/roleCheck')
const User = require('../models/User')

router.post('/register', register)
router.post('/login', login)

router.get('/users', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password')
  res.json(users)
})

router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.json({ message: 'User deleted' })
})

module.exports = router