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
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const signupController = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { userName, email, password, googlePic } = req.body;

    // Parse location JSON
    let location = null;
    if (req.body.location) {
      location = JSON.parse(req.body.location);
    }

    // If file uploaded use Cloudinary; else use googlePic URL
    let profilePic = "";
    if (req.file) {
      profilePic = req.file.path; 
    } else if (googlePic) {
      profilePic = googlePic; // <=== GOOGLE PIC SAVED HERE
    }

    if (!userName || !email || !password) {
      return res.status(400).json({ msg: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already taken!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userLocation = {
      type: "Point",
      coordinates: location?.coordinates || [0, 0],
      address: location?.address || "",
      city: location?.city || "",
    };

    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
      profilePic,
      location: userLocation,
    });

    res.status(201).json({
      msg: "Signup successful ✅",
      user: newUser,
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error.message);
    res.status(500).json({ msg: error.message });
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



const updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    // --------------------------
    // 1. Parse location if sent
    // --------------------------
    let location = null;
    if (req.body.location) {
      try {
        location = JSON.parse(req.body.location);
      } catch {
        return res.status(400).json({ msg: "Invalid location format" });
      }
    }

    // --------------------------
    // 2. Prepare update object
    // --------------------------
    const updateData = {};

    if (req.body.userName) updateData.userName = req.body.userName;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.address) updateData.address = req.body.address;
    if (req.body.city) updateData.city = req.body.city;

    // --------------------------
    // 3. If new profilePic uploaded
    // --------------------------
    if (req.file) {
      updateData.profilePic = req.file.path; // cloudinary URL
    }

    // --------------------------
    // 4. If removePic=true
    // --------------------------
    if (req.body.removePic === "true") {
      updateData.profilePic =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    }

    // --------------------------
    // 5. If location updated
    // --------------------------
    if (location) {
      updateData.location = {
        type: "Point",
        coordinates: location.coordinates,
        address: location.address,
        city: location.city,
      };
    }

    // --------------------------
    // 6. Save to DB
    // --------------------------
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found!" });
    }

    return res.status(200).json({
      msg: "Profile updated successfully ✅",
      user: updatedUser,
    });

  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error.message);
    return res.status(500).json({ msg: error.message });
  }
};





module.exports = { signupController,loginController,getProductsByUser,updateProfile };


