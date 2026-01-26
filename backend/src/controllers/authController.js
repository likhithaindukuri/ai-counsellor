const { createUser, findUserByEmail } = require("../models/userModel");
const { createEmptyProfile } = require("../models/profileModel");
const { createInitialStage } = require("../models/stageModel");

const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        message: "Missing required fields: fullName, email, and password are required" 
      });
    }

    const user = await createUser(fullName, email, password);
    await createEmptyProfile(user.id);
    await createInitialStage(user.id);

    res.status(201).json({ message: "User created", userId: user.id });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      message: "Failed to create user. Please try again later." 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Simple password check (in production, use bcrypt to compare hashed passwords)
    if (user.password !== password) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    res.json({ message: "Login successful", userId: user.id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Login failed. Please try again later." 
    });
  }
};

module.exports = { signup, login };
