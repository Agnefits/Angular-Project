const Cart = require('../models/Cart');
const { validateCart } = require('../utils/validators');


exports.addToCart = async (req, res) => {
    const { error } = validateCart(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id; 


        let cart = await Cart.findOne({ user: userId, state: 'pending' });

        if (cart) {

            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

            if (productIndex > -1) {

                cart.products[productIndex].quantity += (quantity || 1);
            } else {

                cart.products.push({ productId, quantity: quantity || 1 });
            }
            cart = await cart.save();
        } else {

            cart = await Cart.create({
                user: userId,
                products: [{ productId, quantity: quantity || 1 }]
            });
        }

        res.status(200).json({ status: 'success', data: cart });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id, state: 'pending' }).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: "Cart is empty" });
        }
        res.status(200).json({ status: 'success', data: cart });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOneAndUpdate(
            { user: req.user.id, state: 'pending' },
            { $pull: { products: { productId: productId } } },
            { new: true }
        );

        res.status(200).json({ status: 'success', data: cart });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};