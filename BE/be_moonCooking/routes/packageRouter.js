const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../middleware/authenticate");
const {
  getAllPackages,
  addNewPackage,
  updatePackage,
  deletePackage,
  tooglePackageActive,
  getMyPackage,
  getChefPackages,
  getUserPackages,
} = require("../services/CRUDServices");
const { createVNPayUrl, vnpayReturn } = require("../services/paymentServices");

const packageRouter = express.Router();
packageRouter.use(bodyParser.json());
packageRouter.use(authenticate);

packageRouter.get("/get-all", getAllPackages);
packageRouter.get("/get-chef", getChefPackages);
packageRouter.get("/get-user", getUserPackages);
packageRouter.get("/get-my", getMyPackage);
packageRouter.post("/add-package", addNewPackage);
packageRouter.post("/create-payment", createVNPayUrl);
packageRouter.get("/vnpay-return", vnpayReturn);
packageRouter.put("/:packageId/update-package", updatePackage);
packageRouter.put("/:packageId/toggle-active", tooglePackageActive);
packageRouter.delete("/:packageId/delete-package", deletePackage);

module.exports = packageRouter;
