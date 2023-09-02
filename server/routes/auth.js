const express = require('express');
const User = require('../models/user.js');

const router = express.Router();

// Handle sign up
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check for duplicate usernames
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists'} );
        }

        // If we didn't return status 400, then this username password pair is good to be created
        const newUser = new User({ username, password });

        // Save this new user to the db
        await newUser.save();

        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;