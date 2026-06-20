const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20 },
    password: { type: String, required: true, minlength: 8, maxlength: 128, trim: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    address: {
      city: { type: String, trim: true },
      street: { type: String, trim: true },
    },
    favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
