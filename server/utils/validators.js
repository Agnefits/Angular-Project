const Joi = require('joi');

const validateUser = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string()
      .min(8)
      .max(128)
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    address: Joi.object({
      city: Joi.string().min(2).required(),
      street: Joi.string().min(2).required(),
    }).required(),
  });

  return schema.validate(data);
};

const validateProduct = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().min(1),
    title: Joi.string().min(2).max(120).required(),
    description: Joi.string().min(10).required(),
    category: Joi.string().required(),
    price: Joi.number().min(0).required(),
    thumbnail: Joi.string().required(),
    stock: Joi.number().integer().min(0).default(0),
  });

  return schema.validate(data);
};

const validateCart = (data) => {
  const schema = Joi.object({
    productId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Invalid Product ID format',
    }),
    quantity: Joi.number().integer().min(1).default(1),
  });

  return schema.validate(data);
};

module.exports = {
  validateUser,
  validateProduct,
  validateCart,
};
