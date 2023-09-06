const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

// Define user schema
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    plainTextPassword: {type: String, required: true},
    password: {type: String, required: true},
    bedtimes: [{ 
        _id: {type: String},
        bedtime: {type: String} 
    }]
});

// Create function to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        // Compare the user entered plain text password to its hashed counterpart 
        // with bcrypt
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

// Create the model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;