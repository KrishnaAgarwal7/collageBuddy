const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const lostAndFoundRoutes = require('./routes/lostAndFound.routes');
const lostAndFound = require('./models/lostAndFound.model');
const resourceRoute = require('./routes/notes.routes')
const app = express();

app.use(express.json());
require('dotenv').config();
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use('/api/auth' , authRoutes);
app.use('/users' , userRoutes)
app.use('/lost-found' , lostAndFoundRoutes)
app.use('/resources' , resourceRoute)
// app.use('/lost-found/:id' , lostAndFoundRoutes)

// app.use(authRoutes);

module.exports = app;