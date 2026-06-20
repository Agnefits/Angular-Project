const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const app = require('./app');
const { seedInitialData } = require('./utils/seed');

const mongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connection to mongoDB has succeeded');
    await seedInitialData();
  } catch (error) {
    console.log('connection to mongoDB has failed', error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

mongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`the server is running at ${PORT}`);
  });
});
