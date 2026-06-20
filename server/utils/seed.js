const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');
const Product = require('../models/Product');
const User = require('../models/User');

const seedInitialData = async () => {
  const productCount = await Product.countDocuments();

  if (productCount === 0) {
    const sourcePath = path.join(__dirname, '..', '..', 'client', 'src', 'product.json');
    const raw = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
    const products = (raw.product || []).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      price: item.price,
      thumbnail: item.thumbnail,
      stock: item.stock ?? 0,
    }));

    if (products.length > 0) {
      await Product.insertMany(products, { ordered: false });
      console.log(`seeded ${products.length} products`);
    }
  }

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || '123';
  const adminExists = await User.findOne({ username: adminUsername });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await User.collection.insertOne({
      username: adminUsername,
      password: hashedPassword,
      role: 'admin',
      address: {
        city: 'System',
        street: 'Admin',
      },
      favorite: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`seeded admin user: ${adminUsername}`);
  }
};

module.exports = {
  seedInitialData,
};
