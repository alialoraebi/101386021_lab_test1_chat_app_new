const express = require("express");
const userModel = require('../models/user.js'); 
const bcrypt = require("bcryptjs"); 
const routes = express.Router();

// Signup route
routes.post('/signup', async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  try {
      // Check if all required fields are provided
      if (!firstname || !lastname || !username || !email || !password) {
          return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if user already exists
      const existingUser = await userModel.findOne({ username });
      if (existingUser) {
          return res.status(409).json({ message: 'Username already exists' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      const newUser = new userModel({
          firstname,
          lastname,
          username,
          email,
          password: hashedPassword
      });
      await newUser.save();
      res.status(201).json({ message: 'User account created successfully' });
  } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

routes.post("/login", async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Return user data upon successful login
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = routes;
