const mongoose = require('mongoose');

async function connectDb(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGO_URI missing in environment');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    autoIndex: true,
  });
}

module.exports = { connectDb };

