const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../middleware/authenticate");
const {
  getAllSteps,
  addNewStep,
  updateStep,
  deleteStep,
} = require("../services/CRUDServices");

const stepRouter = express.Router();
stepRouter.use(bodyParser.json());
stepRouter.use(authenticate);

stepRouter.get("/get-all", getAllSteps);
stepRouter.post("/add-step", addNewStep);
stepRouter.put("/:stepId/update-step", updateStep);
stepRouter.delete("/:stepId/delete-step", deleteStep);

module.exports = stepRouter;
