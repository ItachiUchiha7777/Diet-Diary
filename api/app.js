const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const mealRoutes = require('./routes/mealRoutes');
require('dotenv').config();

connectDB();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);

module.exports = app;