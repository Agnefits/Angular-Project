const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    description: { type: String, required: true, trim: true, minlength: 10 },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    thumbnail: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
