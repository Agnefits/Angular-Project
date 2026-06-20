const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validateUser } = require('../utils/validators');

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '90d' });
};

const sanitizeUser = (user) => {
  const plain = user.toObject ? user.toObject() : user;
  delete plain.password;
  return plain;
};

exports.signup = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
      address: req.body.address,
      role: 'user',
    });

    const token = signToken(newUser._id, newUser.role);

    res.status(201).json({
      status: 'success',
      token,
      data: { user: sanitizeUser(newUser) },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter your username and password' });
    }

    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = signToken(user._id, user.role);
    res.status(200).json({
      status: 'success',
      token,
      data: { user: sanitizeUser(user) },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token or expired session', error: err.message });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }

    next();
  };
};
