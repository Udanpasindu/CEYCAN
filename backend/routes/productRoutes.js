const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

router.route('/').get(getProducts).post(createProduct);
router.route('/category/:categoryId').get(getProductsByCategory);
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

module.exports = router;
