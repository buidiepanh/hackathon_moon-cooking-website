require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const allowList = ["/authen/login", "/authen/signup", "/restaurants"];
  if (allowList.find((item) => item === req.originalUrl.startsWith(item)))
    next();
  const token = req?.headers?.authorization?.split(" ")?.[1];
  if (!token) return res.status(401).json("Unauthorization!");

  try {
    let decodeToken;
    decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeToken;
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
