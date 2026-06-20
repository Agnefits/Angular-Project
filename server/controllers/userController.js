const User = require('../models/User');

exports.toggleFavorite = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id; 

        const user = await User.findById(userId);

        const isFavorite = user.favorite.includes(productId);

        let update;
        if (isFavorite) {
            update = { $pull: { favorite: productId } };
        } else {
            update = { $addToSet: { favorite: productId } };
        }

        const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true })
            .populate('favorite'); 

        res.status(200).json({
            status: 'success',
            message: isFavorite ? "removed from favorites" : "added to favorites",
            data: { favorites: updatedUser.favorite }
        });

    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getMyFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorite');
        res.status(200).json({
            status: 'success',
            data: { favorites: user.favorite }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};