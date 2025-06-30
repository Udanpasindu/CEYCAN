const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  getUserProfile,
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Simplified token containing only necessary user info
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    // Log successful login
    console.log(`User logged in: ${user.name} (${user.email})`);
    
    // Return simplified user info
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
}));

router.route('/profile').get(protect, getUserProfile);

// Super admin routes
router
  .route('/')
  .get(getUsers)
  .post(protect, superAdmin, createUser);

router
  .route('/:id')
  .get(protect, superAdmin, getUserById)
  .put(protect, superAdmin, updateUser)
  .delete(protect, superAdmin, deleteUser);

module.exports = router;
