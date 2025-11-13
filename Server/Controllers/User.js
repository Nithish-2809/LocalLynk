const User = require("../Models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required!" });
    }

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found. Please sign up first." });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid email or password." });
    }


    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET ,
      { expiresIn: "30d" }
    );

    
    res.status(200).json({
      msg: "Login successful!",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        profilePic: user.profilePic,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const signupController = async (req, res) => {
  try {
    const { userName, email, password, profilePic, location } = req.body;


    if (!userName || !email || !password) {
      return res.status(400).json({ msg: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already taken. Please use another one." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userLocation = {
      type: "Point",
      coordinates: location?.coordinates || [0, 0],
      address: location?.address || "",
      city: location?.city || "",
    }

    // 5️⃣ Create user
    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
      profilePic: profilePic || "",
      location: userLocation,
    });

    // 6️⃣ Response
    res.status(201).json({
      msg: "User created successfully!",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        location: newUser.location,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getProductsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const products = await Product.find({ Seller: userId })
      .sort({ createdAt: -1 })
      .populate("Seller", "userName email");

    res.status(200).json({
      msg: "User's products fetched successfully!",
      total: products.length,
      products,
    });

  } catch (error) {
    res.status(500).json({
      msg: "Error fetching user's products",
      error: error.message,
    });
  }
};


module.exports = { signupController,loginController,getProductsByUser };


