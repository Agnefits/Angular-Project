const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { validateCart, validateCheckout } = require('../utils/validators');

const populateCart = (query) => query.populate('products.productId');

const removeMissingProducts = async (cart) => {
    if (!cart) return cart;

    const validProducts = cart.products.filter((item) => item.productId);
    if (validProducts.length !== cart.products.length) {
        cart.products = validProducts;
        await cart.save();
    }

    return cart;
};

const getCartTotal = (cart) => cart.products.filter((item) => item.productId).reduce((total, item) => {
    const product = item.productId;
    return total + (product?.price || 0) * item.quantity;
}, 0);

const buildOrderItems = (cart) => cart.products.filter((item) => item.productId).map((item) => ({
    product: item.productId._id,
    owner: item.productId.owner,
    title: item.productId.title,
    thumbnail: item.productId.thumbnail,
    price: item.productId.price,
    quantity: item.quantity,
}));

exports.addToCart = async (req, res) => {
    const { error } = validateCart(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const { productId, quantity } = req.body;
        const requestedQuantity = quantity || 1;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.stock < requestedQuantity) return res.status(400).json({ message: 'Not enough product stock' });

        const userId = req.user.id;
        let cart = await Cart.findOne({ user: userId, state: 'pending' });

        if (cart) {
            const productIndex = cart.products.findIndex(p => p.productId?.toString() === productId);
            if (productIndex > -1) {
                const nextQuantity = cart.products[productIndex].quantity + requestedQuantity;
                if (nextQuantity > product.stock) return res.status(400).json({ message: 'Not enough product stock' });
                cart.products[productIndex].quantity = nextQuantity;
            } else {
                cart.products.push({ productId, quantity: requestedQuantity });
            }
            cart = await cart.save();
        } else {
            cart = await Cart.create({ user: userId, products: [{ productId, quantity: requestedQuantity }] });
        }

        cart = await populateCart(Cart.findById(cart._id));
        cart = await removeMissingProducts(cart);
        res.status(200).json({ status: 'success', data: cart });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        let cart = await populateCart(Cart.findOne({ user: req.user.id, state: 'pending' }));
        cart = await removeMissingProducts(cart);
        if (!cart || cart.products.length === 0) return res.status(404).json({ message: 'Cart is empty' });
        res.status(200).json({ status: 'success', data: cart });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getCartCount = async (req, res) => {
    try {
        const cart = await populateCart(Cart.findOne({ user: req.user.id, state: 'pending' }));
        const count = cart ? cart.products.filter((item) => item.productId).reduce((total, item) => total + item.quantity, 0) : 0;
        res.status(200).json({ status: 'success', data: { count } });
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
        ).populate('products.productId');
        const cleanedCart = await removeMissingProducts(cart);
        res.status(200).json({ status: 'success', data: cleanedCart });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.checkout = async (req, res) => {
    const { error } = validateCheckout(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        let cart = await populateCart(Cart.findOne({ user: req.user.id, state: 'pending' }));
        cart = await removeMissingProducts(cart);
        if (!cart || cart.products.length === 0) return res.status(400).json({ message: 'Cart is empty' });

        const totalPrice = getCartTotal(cart);
        const order = await Order.create({
            buyer: req.user._id,
            items: buildOrderItems(cart),
            totalPrice,
            paymentMethod: 'cash_on_delivery',
            paymentStatus: 'pending',
            status: 'Pending',
            tracking: [{ status: 'Pending', note: 'Order created', changedBy: req.user._id }],
        });

        cart.paymentMethod = 'cash_on_delivery';
        cart.state = 'cash_on_delivery';
        await cart.save();

        res.status(200).json({ status: 'success', message: 'Order placed successfully.', paymentMethod: 'cash_on_delivery', data: order });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};
