const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../middleware/authenticate");
const {
  getAllFeatures,
  addNewFeature,
  updateFeature,
  deleteFeature,
} = require("../services/CRUDServices");

const featRouter = express.Router();
featRouter.use(bodyParser.json());
featRouter.use(authenticate);

featRouter.get("/get-all", getAllFeatures);
featRouter.post("/add-feat", addNewFeature);
featRouter.put("/:featId/update-feat", updateFeature);
featRouter.delete("/:featId/delete-feat", deleteFeature);

module.exports = featRouter;
