import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Create JWT Token with user ID and role
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    // Generate token with user role
    const token = createToken(user._id, user.role);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Register user
const registerUser = async (req, res) => {
  const { name, email, password, role = "user" } = req.body;
  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Validate email format and password strength
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters",
        });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const user = await newUser.save();
    const token = createToken(user._id, user.role);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export { loginUser, registerUser };
