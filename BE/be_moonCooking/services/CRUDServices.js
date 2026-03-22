const Features = require("../models/feature");
const Receipts = require("../models/receipt");
const Restaurants = require("../models/restaurant");
const Steps = require("../models/step");
const Subscriptions = require("../models/subscription");
const Users = require("../models/user");

//======================USER ACCOUNT============================

const getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      const result = await Users.find({}).populate("restaurants", "license");

      if (!result) {
        return res.status(400).json("No user found!");
      }

      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const getAuthenticatedUser = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await Users.findOne({ _id: id });

    if (!user) return res.status(400).json("No user found!");
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const activateOrDeactivateAccount = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      const user = await Users.findOne({ _id: req.params.userId });
      if (!user) return res.status(400).json("No user found!");

      const result = await Users.findByIdAndUpdate(
        user._id,
        { $set: { active: !user.active } },
        { new: true },
      );

      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await Users.findOne({ _id: req.user._id });
    if (!user) return res.status(400).json("No user found!");

    const result = await Users.findByIdAndUpdate(
      user._id,
      { $set: req.body },
      { new: true },
    );

    if (!result) return res.status(400).json("Cannot update profile!");

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

//=========================RECEIPT================================

const getAllReceipts = async (req, res, next) => {
  try {
    const result = await Receipts.find({});

    if (!result) return res.status(400).json("Cannot get cooking receipts!");

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getReceiptDetails = async (req, res, next) => {
  try {
    const id = req.params.receiptId;
    const receipt = await Receipts.findOne({ _id: id })
      .populate("steps")
      .populate("createdByChef", "username");
    if (!receipt) return res.status(400).json("No receipt found!");

    return res.status(200).json(receipt);
  } catch (error) {
    next(error);
  }
};

const addNewReceipt = async (req, res, next) => {
  try {
    if (req.user.role === "CHEF") {
      const result = await Receipts.create({
        foodName: req.body.foodName,
        createdByChef: req.user._id,
        steps: req.body.steps,
      });

      if (!result)
        return res.status(400).json("Cannot add new cooking receipt!");

      await Users.findByIdAndUpdate(req.user._id, { $push: result._id });
      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const updateReceipt = async (req, res, next) => {
  try {
    if (req.user.role === "CHEF") {
      const id = req.params.receiptId;
      const existReceipt = await Receipts.findOne({ _id: id });
      if (!existReceipt)
        return res.status(400).json("No cooking receipt found!");

      const result = await Receipts.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true },
      );

      if (!result)
        return res.status(400).json("Cannot update cooking receipt!");

      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const ratingReceipt = async (req, res, next) => {
  try {
    const id = req.params.receiptId;
    const receipt = await Receipts.findOne({ _id: id });
    if (!receipt) return res.status(400).json("No receipt found!");

    const rate = Number(req.body.rating);
    if (rate < 0 || rate > 5) {
      return res.status(400).json("Rating must be between 0 and 5");
    }

    const result = await Receipts.findByIdAndUpdate(
      id,
      {
        $push: { rating: Number(req.body.rating) },
      },
      { new: true },
    );

    if (!result) return res.status(400).json("Cannot rate this receipt!");
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteReceipt = async (req, res, next) => {
  try {
    if (req.user.role === "CHEF") {
      const id = req.params.receiptId;
      const existReceipt = await Receipts.findOne({ _id: id });
      if (!existReceipt)
        return res.status(400).json("No cooking receipt found!");

      const result = await Receipts.findByIdAndDelete(id);

      if (!result)
        return res.status(400).json("Cannot delete cooking receipt!");

      return res.status(200).json("Delete receipt successfully!");
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

//==========================STEP==================================
const getAllSteps = async (req, res, next) => {
  try {
    if (req.user.role === "CHEF") {
      const result = await Steps.find({});

      if (!result) return res.status(400).json("Cannot get cooking step!");

      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const addNewStep = async (req, res, next) => {
  try {
    if (req.user.role === "CHEF") {
      const result = await Steps.create(req.body);

      if (!result) return res.status(400).json("Cannot add new cooking step!");

      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const updateStep = async (req, res, next) => {
  try {
    if (req.user.role === "CHEF") {
      const step = req.params.stepId;
      const existStep = await Steps.findOne({ _id: step });
      if (!existStep) return res.status(400).json("No cooking step found!");

      const result = await Steps.findByIdAndUpdate(
        step,
        { $set: req.body },
        { new: true },
      );

      if (!result) return res.status(400).json("Cannot update cooking step!");

      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const deleteStep = async (req, res, next) => {
  try {
    if (req.user.role === "CHEF") {
      const step = req.params.stepId;
      const existStep = await Steps.findOne({ _id: step });
      if (!existStep) return res.status(400).json("No cooking step found!");

      const result = await Steps.findByIdAndDelete(step);

      if (!result) return res.status(400).json("Cannot delete cooking step!");

      return res.status(200).json("Delete step successfully!");
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

//===========================RESTAURANT============================
const getAllRestaurants = async (req, res, next) => {
  try {
    const result = await Restaurants.find({}).select("-license");

    if (!result) return res.status(400).json("No restaurant found!");

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getRestaurantDetail = async (req, res, next) => {
  try {
    const id = req.params.restaurantId;
    const restau = await Restaurants.findOne({ _id: id })
      .populate("dishes", "foodName")
      .populate("ownBy", "username");
    if (!restau) return res.status(400).json("No restaurant found!");

    return res.status(200).json(restau);
  } catch (error) {
    next(error);
  }
};

const getMyRestaurant = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const restau = await Restaurants.find({ ownBy: userId })
      .populate("dishes", "foodName")
      .populate("ownBy", "username");
    if (!restau) return res.status(400).json("No restaurant found!");

    return res.status(200).json(restau);
  } catch (error) {
    next(error);
  }
};

const addNewRestaurant = async (req, res, next) => {
  try {
    if (req.user.role === "CHEF") {
      const result = await Restaurants.create({
        restaurantName: req.body.restaurantName,
        license: req.body.license,
        ownBy: req.user._id,
        dishes: req.body.dishes,
        seats: req.body.seats,
        address: req.body.address,
      });
      if (!result) return res.status(400).json("Cannot add new restaurant!");

      await Users.findByIdAndUpdate(req.user._id, {
        $push: { restaurants: result._id },
      });
      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const updateRestaurant = async (req, res, next) => {
  try {
    if (req.user.role === "CHEF") {
      const id = req.params.restaurantId;
      const restau = await Restaurants.findOne({ _id: id });
      if (!restau) return res.status(400).json("No restaurant found!");

      const result = await Restaurants.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true },
      );
      if (!result)
        return res.status(400).json("Cannot update restaurant informations!");

      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const deleteRestaurant = async (req, res, next) => {
  try {
    if (req.user.role === "CHEF") {
      const id = req.params.restaurantId;
      const restau = await Restaurants.findOne({ _id: id });
      if (!restau) return res.status(400).json("No restaurant found!");

      const result = await Restaurants.findByIdAndDelete(id);
      if (!result) return res.status(400).json("Cannot delete restaurant!");

      return res.status(200).json("Delete restaurant successfull!");
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

//===========================FEATURES================================
const getAllFeatures = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      const result = await Features.find({});
      if (!result) return res.status(400).json("No feature found!");

      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const addNewFeature = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      const result = await Features.create(req.body);
      if (!result) return res.status(400).json("Cannot add new feature!");

      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const updateFeature = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      const id = req.params.featId;
      const feat = await Features.findOne({ _id: id });
      if (!feat) return res.status(400).json("No feature found!");

      const result = await Features.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true },
      );
      if (!result) return res.status(400).json("Cannot update feature!");

      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const deleteFeature = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      const id = req.params.featId;
      const feat = await Features.findOne({ _id: id });
      if (!feat) return res.status(400).json("No feature found!");

      const result = await Features.findByIdAndDelete(id);
      if (!result) return res.status(400).json("Cannot delete feature!");

      return res.status(200).json("Delete feature successfully!");
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

//===========================SUBSCRIPTION PACKAGES====================
const getAllPackages = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      const result = await Subscriptions.find({}).populate("features");

      if (!result) return res.status(400).json("No package found!");

      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const getChefPackages = async (req, res, next) => {
  try {
    if (req.user.role === "CHEF") {
      const result = await Subscriptions.find({
        subscriptionType: "CHEF_SUBSCRIPTION",
      }).populate("features");

      if (!result) return res.status(400).json("No package found!");

      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const getUserPackages = async (req, res, next) => {
  try {
    if (req.user.role === "USER") {
      const result = await Subscriptions.find({
        subscriptionType: "USER_SUBSCRIPTION",
      }).populate("features");

      if (!result) return res.status(400).json("No package found!");

      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenticated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const getMyPackage = async (req, res, next) => {
  try {
    const uId = req.user._id;
    const user = await Users.findOne({ _id: uId });
    if (!user) return res.status(400).json("No user found!");

    const result = await Subscriptions.findOne({ _id: user.subscription });
    if (!result) return res.status(400).json("No subscription package found!");

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const addNewPackage = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      const result = await Subscriptions.create(req.body);

      if (!result) return res.status(400).json("Cannot add new package!");
      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenitcated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const updatePackage = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      const id = req.params.packageId;
      const package = await Subscriptions.findOne({ _id: id });
      if (!package) return res.status(400).json("No package found!");

      const result = await Subscriptions.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true },
      );
      if (!result) return res.status(400).json("Cannot update package!");
      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenitcated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const tooglePackageActive = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      const id = req.params.packageId;
      const package = await Subscriptions.findOne({ _id: id });
      if (!package) return res.status(400).json("No package found!");

      const result = await Subscriptions.findByIdAndUpdate(
        id,
        { $set: { available: !package.available } },
        { new: true },
      );
      if (!result) return res.status(400).json("Cannot activate this package!");
      return res.status(200).json(result);
    } else {
      return res.status(400).json("You are not authenitcated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

const deletePackage = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      const id = req.params.packageId;
      const package = await Subscriptions.findOne({ _id: id });
      if (!package) return res.status(400).json("No package found!");

      const result = await Subscriptions.findByIdAndDelete(id);
      if (!result) return res.status(400).json("Cannot delete package!");
      return res.status(200).json("Delete package successfully!");
    } else {
      return res.status(400).json("You are not authenitcated for this API!");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getAuthenticatedUser,
  activateOrDeactivateAccount,
  updateUserProfile,

  getAllSteps,
  addNewStep,
  updateStep,
  deleteStep,

  getAllReceipts,
  getReceiptDetails,
  addNewReceipt,
  updateReceipt,
  ratingReceipt,
  deleteReceipt,

  getAllRestaurants,
  getRestaurantDetail,
  getMyRestaurant,
  addNewRestaurant,
  updateRestaurant,
  deleteRestaurant,

  getAllFeatures,
  addNewFeature,
  updateFeature,
  deleteFeature,

  getAllPackages,
  getChefPackages,
  getUserPackages,
  getMyPackage,
  addNewPackage,
  updatePackage,
  tooglePackageActive,
  deletePackage,
};
