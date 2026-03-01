const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const { connectDb } = require('../config/db');
const User = require('../models/User');

async function run() {
  const email = process.argv[2];
  if (!email) {
    // eslint-disable-next-line no-console
    console.error('Usage: node src/scripts/makeAdmin.js <email>');
    process.exit(1);
  }

  await connectDb(process.env.MONGO_URI);
  const user = await User.findOneAndUpdate({ email }, { $set: { role: 'admin' } }, { new: true }).select('-password');
  if (!user) {
    // eslint-disable-next-line no-console
    console.error('User not found:', email);
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.log('Updated user to admin:', user.email);

  await mongoose.disconnect();
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

