const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');

router.use(authController.protect);
router.get('/mine', orderController.getMyOrders);
router.get('/received', orderController.getReceivedOrders);
router.get('/all', authController.restrictTo('admin'), orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
