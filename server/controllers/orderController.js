const Order = require('../models/Order');

const populateOrder = (query) => query
  .populate('buyer', 'username address role')
  .populate('items.product')
  .populate('items.owner', 'username')
  .populate('tracking.changedBy', 'username role');

const canViewOrder = (order, user) => {
  if (!order || !user) return false;
  if (user.role === 'admin') return true;
  if (order.buyer?._id?.toString?.() === user._id.toString() || order.buyer?.toString?.() === user._id.toString()) return true;
  return order.items.some((item) => {
    const owner = item.owner?._id || item.owner;
    return owner && owner.toString() === user._id.toString();
  });
};

const canUpdateOrder = (order, user) => {
  if (!order || !user) return false;
  if (user.role === 'admin') return true;
  return order.items.some((item) => {
    const owner = item.owner?._id || item.owner;
    return owner && owner.toString() === user._id.toString();
  });
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await populateOrder(Order.find({ buyer: req.user._id }).sort({ createdAt: -1 }));
    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.getReceivedOrders = async (req, res) => {
  try {
    const orders = await populateOrder(Order.find({ 'items.owner': req.user._id }).sort({ createdAt: -1 }));
    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await populateOrder(Order.find().sort({ createdAt: -1 }));
    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await populateOrder(Order.findById(req.params.id));
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!canViewOrder(order, req.user)) return res.status(403).json({ message: 'You cannot view this order' });
    res.status(200).json({ status: 'success', data: order });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const allowed = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const { status, note = '' } = req.body;
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid order status' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!canUpdateOrder(order, req.user)) return res.status(403).json({ message: 'You cannot update this order' });

    order.status = status;
    order.tracking.push({ status, note, changedBy: req.user._id, changedAt: new Date() });
    await order.save();

    const updatedOrder = await populateOrder(Order.findById(order._id));
    res.status(200).json({ status: 'success', data: updatedOrder });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
