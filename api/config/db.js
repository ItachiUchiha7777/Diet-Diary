const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect("mongodb+srv://rohit:rohit@cluster0.gpb0tqv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;