const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

router.get('/', productController.getAllProducts);
router.get('/mine', authController.protect, productController.getMyProducts);
router.get('/:id', productController.getProductById);
router.post('/', authController.protect, productController.createProduct);
router.post('/add', authController.protect, productController.createProduct);
router.put('/:id', authController.protect, productController.updateProduct);
router.delete('/:id', authController.protect, productController.deleteProduct);

module.exports = router;
