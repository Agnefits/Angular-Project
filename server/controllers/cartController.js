const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { validateCart, validateCheckout } = require('../utils/validators');

const populateCart = (query) => query.populate('products.productId');

const getCartTotal = (cart) => cart.products.reduce((total, item) => {
    const product = item.productId;
    return total + (product?.price || 0) * item.quantity;
}, 0);

const buildOrderItems = (cart) => cart.products.map((item) => ({
    product: item.productId._id,
    owner: item.productId.owner,
    title: item.productId.title,
    thumbnail: item.productId.thumbnail,
    price: item.productId.price,
    quantity: item.quantity,
}));

const createStripePaymentIntent = async ({ amount, paymentMethodId }) => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('Stripe is not configured. Add STRIPE_SECRET_KEY to server environment.');
    }
    if (!paymentMethodId) {
        throw new Error('Stripe payment method is required.');
    }

    const body = new URLSearchParams({
        amount: String(Math.round(amount * 100)),
        currency: process.env.STRIPE_CURRENCY || 'usd',
        payment_method: paymentMethodId,
        confirm: 'true',
        automatic_payment_methods: JSON.stringify({ enabled: true, allow_redirects: 'never' }),
    });

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
    });

    const result = await response.json();
    if (!response.ok || result.status !== 'succeeded') {
        throw new Error(result?.error?.message || 'Stripe payment failed');
    }

    return result;
};

exports.addToCart = async (req, res) => {
    const { error } = validateCart(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        let cart = await Cart.findOne({ user: userId, state: 'pending' });

        if (cart) {
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            if (productIndex > -1) cart.products[productIndex].quantity += (quantity || 1);
            else cart.products.push({ productId, quantity: quantity || 1 });
            cart = await cart.save();
        } else {
            cart = await Cart.create({ user: userId, products: [{ productId, quantity: quantity || 1 }] });
        }

        cart = await populateCart(Cart.findById(cart._id));
        res.status(200).json({ status: 'success', data: cart });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await populateCart(Cart.findOne({ user: req.user.id, state: 'pending' }));
        if (!cart || cart.products.length === 0) return res.status(404).json({ message: 'Cart is empty' });
        res.status(200).json({ status: 'success', data: cart });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getCartCount = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id, state: 'pending' });
        const count = cart ? cart.products.reduce((total, item) => total + item.quantity, 0) : 0;
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
        res.status(200).json({ status: 'success', data: cart });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.checkout = async (req, res) => {
    const { error } = validateCheckout(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const cart = await populateCart(Cart.findOne({ user: req.user.id, state: 'pending' }));
        if (!cart || cart.products.length === 0) return res.status(400).json({ message: 'Cart is empty' });

        const totalPrice = getCartTotal(cart);
        let paymentStatus = 'pending';
        let stripePaymentIntentId;

        if (req.body.paymentMethod === 'stripe') {
            const paymentIntent = await createStripePaymentIntent({ amount: totalPrice, paymentMethodId: req.body.paymentMethodId });
            paymentStatus = 'paid';
            stripePaymentIntentId = paymentIntent.id;
        }

        const order = await Order.create({
            buyer: req.user._id,
            items: buildOrderItems(cart),
            totalPrice,
            paymentMethod: req.body.paymentMethod,
            paymentStatus,
            stripePaymentIntentId,
            status: 'Pending',
            tracking: [{ status: 'Pending', note: 'Order created', changedBy: req.user._id }],
        });

        cart.paymentMethod = req.body.paymentMethod;
        cart.state = req.body.paymentMethod === 'stripe' ? 'paid' : 'cash_on_delivery';
        await cart.save();

        res.status(200).json({ status: 'success', message: 'Order placed successfully.', paymentMethod: req.body.paymentMethod, data: order });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};
