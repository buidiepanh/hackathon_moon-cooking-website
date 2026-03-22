const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../middleware/authenticate");
const {
  getAllReceipts,
  addNewReceipt,
  updateReceipt,
  deleteReceipt,
  getReceiptDetails,
  ratingReceipt,
} = require("../services/CRUDServices");

const receiptRouter = express.Router();
receiptRouter.use(bodyParser.json());
receiptRouter.use(authenticate);

receiptRouter.get("/get-all", getAllReceipts);
receiptRouter.get("/:receiptId", getReceiptDetails);
receiptRouter.post("/add-receipt", addNewReceipt);
receiptRouter.put("/:receiptId/rating", ratingReceipt);
receiptRouter.put("/:receiptId/update-receipt", updateReceipt);
receiptRouter.delete("/:receiptId/delete-receipt", deleteReceipt);

module.exports = receiptRouter;
