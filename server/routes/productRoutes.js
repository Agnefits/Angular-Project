const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', authController.protect, productController.createProduct);
router.post('/add', authController.protect, productController.createProduct);
router.put('/:id', authController.protect, authController.restrictTo('admin'), productController.updateProduct);
router.delete('/:id', authController.protect, authController.restrictTo('admin'), productController.deleteProduct);

module.exports = router;
