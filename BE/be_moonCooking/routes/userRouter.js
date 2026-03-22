const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../middleware/authenticate");
const {
  getAllUsers,
  getAuthenticatedUser,
  activateOrDeactivateAccount,
  updateUserProfile,
} = require("../services/CRUDServices");

const userRouter = express.Router();
userRouter.use(bodyParser.json());
userRouter.use(authenticate);

userRouter.get("/get-all", getAllUsers);
userRouter.get("/get-authenticated-user", getAuthenticatedUser);
userRouter.put("/:userId/toggle-active", activateOrDeactivateAccount);
userRouter.put("/update-profile", updateUserProfile);

module.exports = userRouter;
