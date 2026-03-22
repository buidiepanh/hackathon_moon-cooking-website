const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../middleware/authenticate");
const {
  getAllRestaurants,
  getRestaurantDetail,
  addNewRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurant,
} = require("../services/CRUDServices");

const restaurantRouter = express.Router();
restaurantRouter.use(bodyParser.json());
restaurantRouter.use(authenticate);

restaurantRouter.get("/get-all", getAllRestaurants);
restaurantRouter.get("/get-my", getMyRestaurant);
restaurantRouter.get("/:restaurantId", getRestaurantDetail);
restaurantRouter.post("/add-restaurant", addNewRestaurant);
restaurantRouter.put("/:restaurantId/update-restaurant", updateRestaurant);
restaurantRouter.delete("/:restaurantId/delete-restaurant", deleteRestaurant);

module.exports = restaurantRouter;
