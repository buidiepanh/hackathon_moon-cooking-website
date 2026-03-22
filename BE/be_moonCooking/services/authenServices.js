require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/user");

const registerAccount = async (req, res, next) => {
  try {
    const hashPass = await bcrypt.hash(req.body.password, 10);
    const user = await Users.findOne({ email: req.body.email });

    if (user) {
      res.status(400).json("Email is already exist!");
      return null;
    }

    const result = await Users.create({
      username: req.body.username,
      email: req.body.email,
      password: hashPass,
      phone: req.body.phone,
      role: req.body.role,
    });

    if (!result) res.status(400).json("Can't register account!");

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const loginAccount = async (req, res, next) => {
  try {
    const existUser = await Users.findOne({ email: req.body.email }).lean();

    if (existUser) {
      if (existUser.active === false)
        return res
          .status(400)
          .json("Account is inactive, please try again later!");

      const correctPass = await bcrypt.compare(
        req.body.password,
        existUser.password,
      );

      if (correctPass) {
        const token = jwt.sign(existUser, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return res.status(200).json({ accessToken: token });
      } else {
        return res.status(400).json("Incorrect password!");
      }
    } else {
      return res.status(400).json("No email found!");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { registerAccount, loginAccount };
