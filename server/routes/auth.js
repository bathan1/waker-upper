const express = require('express');
const User = require('../models/user.js');
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

// Instantiate router
const router = express.Router();

// Handle sign up
router.post('/signup', async (req, res) => {
    try {
        // Extract username and plain text password from the request body
        const { username, password } = req.body;

        // Check for duplicate usernames
        const existingUser = await User.findOne({ username });
        // If the username exists, then return status 400 to indicate failure.
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists'} );
        }
        
        // Hash the password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // If we didn't return status 400, then this username password pair is good to be created
        const newUser = new User({ username, plainTextPassword: password, password: encryptedPassword, bedtimes: [] });

        // Save this new user to the db
        await newUser.save();

        // If we made it this far, then the user was successfully registered and return 201
        res.status(201).json({ message: 'User registered' });
    } catch (error) { // Catch any internal server errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Handle sign in
router.post("/signin", async (req, res) => {
    try {
        // Extract username and plain text password from the form.
        const { username, password } = req.body;

        // Check to make sure the user exists
        const existingUser = await User.findOne({ username });

        // If the user doesn't exist, then return 400 to indicate failure
        if (!existingUser) {
            return res.status(400).json({ message: `Username ${username} not found` });
        }

        // Check if the password is valid using the User schema 
        const isValidPassword = await existingUser.comparePassword(password);

        // If the pass is invalid, then return 401 to indicate failure to log in
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // If we made it this far, then return 201 to indicate successful login
        return res.status(201).json({ message: "Logged in successfully", user: existingUser });
    } catch (error) { // Catch any internal server failures
        console.error(error);
        res.status(500).json({ message: "Internal server failure" });
    }
});

// Handle saving bedtimes
router.put("/api/users/:userId/bedtimes", async (req, res) => {
    try {
        // Get the userId from the url (aka params)
        const userId = req.params.userId;
        // Get the bedtimes from the body of the request
        const newBedtimes = req.body.bedtimes;

        // Find the user using the userID
        const user = await User.findByIdAndUpdate(new ObjectId(userId), { bedtimes: newBedtimes }, { new: true });

        // If user doesn't exist, return 404
        if (!user) {
            return res.status(404).json({ message: "User not found error" });
        }

        // Return 200 to indicate successful update
        return res.status(200).json({ message: "Bedtime updated successfully" });
    } catch (error) { // Catch any internal server errors/
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Handle deleting bedtimes
router.delete("/api/users/:userId/bedtimes/:bedtimeId", async (req, res) => {
    // Get the userId and the id of the bedtime object to be deleted from the url (params)
    const userId = req.params.userId;
    const bedtimeId = req.params.bedtimeId;

    try {
        // Find user
        const user = await User.findById(new ObjectId(userId));

        // If not found, return 404
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get the index to remove
        const indexToRemove = user.bedtimes.findIndex((bedtime) => bedtime._id === bedtimeId);

        // If index isn't found, then return 404
        if (indexToRemove === -1) {
            return res.status(404).json({ message: "Bedtime object not found" });
        }

        // Remove the user 
        user.bedtimes.splice(indexToRemove, 1);

        await user.save(); // Save to DB
        
        // Return 200 to indicate successful removal
        return res.status(200).json({ message: "Bedtime successfully removed" });
    } catch (error) { // Catch any server failures and return 500
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;