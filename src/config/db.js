// src/config/db.js
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error('Mongo URI env not set (MONGODB_URI or MONGO_URI)');

  await mongoose.connect(uri, { autoIndex: true, maxPoolSize: 10 });
  console.log('✅ Connected to MongoDB Atlas');
}
module.exports = connectDB;
