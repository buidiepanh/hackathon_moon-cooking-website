const express = require("express");
const bodyParser = require("body-parser");
const { registerAccount, loginAccount } = require("../services/authenServices");

const authenRouter = express.Router();
authenRouter.use(bodyParser.json());

authenRouter.post("/signup", registerAccount);
authenRouter.post("/login", loginAccount);

module.exports = authenRouter;
