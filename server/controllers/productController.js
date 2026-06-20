const Product = require('../models/Product');
const { validateProduct } = require('../utils/validators');

const buildProductPayload = (body) => {
  const payload = {
    title: body.title,
    description: body.description,
    category: body.category,
    price: body.price,
    thumbnail: body.thumbnail,
    stock: Number.isFinite(Number(body.stock)) ? Number(body.stock) : 0,
  };

  if (body.id !== undefined && body.id !== null && body.id !== '') {
    payload.id = Number(body.id);
  }

  return payload;
};

const getNextProductId = async () => {
  const lastProduct = await Product.findOne().sort({ id: -1 }).select('id');
  return lastProduct ? lastProduct.id + 1 : 1;
};

const canManageProduct = (product, user) => {
  if (!product || !user) return false;
  if (user.role === 'admin') return true;
  return product.owner && product.owner.toString() === user._id.toString();
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'error in fetching products', error: error.message });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user._id }).sort({ id: 1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'error in fetching your products', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'error in fetching product', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const payload = buildProductPayload(req.body);
    payload.owner = req.user._id;

    if (!payload.id) {
      payload.id = await getNextProductId();
    }

    const existing = await Product.findOne({ id: payload.id });
    if (existing) {
      return res.status(409).json({ message: 'Product id already exists' });
    }

    const newProduct = await Product.create(payload);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'error in creating product', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const product = await Product.findOne({ id: Number(req.params.id) });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!canManageProduct(product, req.user)) {
      return res.status(403).json({ message: 'You can only update your own products' });
    }

    const payload = buildProductPayload(req.body);
    payload.id = Number(req.params.id);
    payload.owner = product.owner || req.user._id;

    const updatedProduct = await Product.findOneAndUpdate({ id: Number(req.params.id) }, payload, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'error in updating product', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!canManageProduct(product, req.user)) {
      return res.status(403).json({ message: 'You can only delete your own products' });
    }

    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'error in deleting product', error: error.message });
  }
};
