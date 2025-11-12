const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const restrictToLoggedinUserOnly = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next(); 
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(401).json({ msg: "Invalid or expired token!" });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: "No token provided, access denied!" });
  }
};

module.exports = { restrictToLoggedinUserOnly };
