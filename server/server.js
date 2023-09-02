const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth'); // Import POST requests for signing up users

// Begin Express App
const app = express();

// Save React Build path
const buildDir = '../client/build';

// Use static middleware to serve final React Build file
app.use(express.static(path.join(__dirname, buildDir)));

// Set up json data parsing
app.use(express.json());

// Mount signup page route
app.use('/auth', authRoutes);

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});