const User = require('../models/User');
const Product = require('../models/Product');

exports.toggleFavorite = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const isFavorite = user.favorite.some((item) => item.toString() === productId);
        const update = isFavorite ? { $pull: { favorite: productId } } : { $addToSet: { favorite: productId } };
        const updatedUser = await User.findByIdAndUpdate(req.user.id, update, { new: true }).populate('favorite');

        res.status(200).json({
            status: 'success',
            message: isFavorite ? 'removed from favorites' : 'added to favorites',
            data: { favorites: updatedUser.favorite, count: updatedUser.favorite.length }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getMyFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorite');
        res.status(200).json({ status: 'success', data: { favorites: user.favorite, count: user.favorite.length } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'Admin cannot delete the current signed-in account' });
        }
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};
