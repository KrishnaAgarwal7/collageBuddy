const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const lostAndFoundRoutes = require('./routes/lostAndFound.routes')
const app = express();

app.use(express.json());
require('dotenv').config();
app.use(cookieParser());
app.use('/api/auth' , authRoutes);
app.use('/users' , userRoutes)
app.use('/lost-found' , lostAndFoundRoutes)

// app.use(authRoutes);

module.exports = app;