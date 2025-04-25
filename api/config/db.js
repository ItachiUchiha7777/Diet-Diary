const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
  try {
    // console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("yea it's up");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;