require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth'); // Import POST requests for signing up users

// Set mongoURI using environment variables
const mongoURI = process.env.DB_HOST;

// Begin Express App
const app = express();

// Set up json data parsing
app.use(express.json());

// Save React Build path
const buildDir = '../client/build';
// Use static middleware to serve final React Build file
app.use(express.static(path.join(__dirname, buildDir)));

// Connect to MongoDB with mongoose
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Reference the Connection object
const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Mount signup page route
app.use(authRoutes);

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});