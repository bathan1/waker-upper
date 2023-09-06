const express = require('express');
const User = require('../models/user.js');
const bcrypt = require("bcrypt");

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
        
        // Hash the password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // If we didn't return status 400, then this username password pair is good to be created
        const newUser = new User({ username, password: encryptedPassword });

        // Save this new user to the db
        await newUser.save();

        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Handle sign in
router.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });

        if (!existingUser) {
            return res.status(400).json({ message: `Username ${username} not found` });
        }

        const isValidPassword = await existingUser.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        return res.status(201).json({ message: "Logged in successfully", _id: existingUser._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server failure" });
    }
});

// Handle saving bedtimes
router.put("/api/users/:userId/bedtimes", async (req, res) => {
    try {
        const userId = req.params.userId;
        const newBedtimes = req.body.bedtimes;

        const user = await User.findByIdAndUpdate(userId, { bedtimes: newBedTimes }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found error" });
        }

        return res.status(200).json({ message: "Bedtime updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = router;