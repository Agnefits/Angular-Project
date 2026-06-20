const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.post('/toggle-favorite', userController.toggleFavorite);
router.get('/my-favorites', userController.getMyFavorites);

module.exports = router;