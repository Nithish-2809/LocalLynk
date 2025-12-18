const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const restrictToLoggedinUserOnly = async (req, res, next) => {
  // ✅ Allow CORS preflight
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;

    // ❌ No token at all
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ msg: "No token provided, access denied!" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach logged-in user
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ msg: "User not found!" });
    }

    // ✅ IMPORTANT: stop execution here
    return next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token!" });
  }
};

module.exports = { restrictToLoggedinUserOnly };
