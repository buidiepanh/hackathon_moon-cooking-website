const { Schema, default: mongoose } = require("mongoose");

const RestaurantSchema = new Schema(
  {
    restaurantName: {
      type: String,
      required: true,
    },
    license: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    ownBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    dishes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Receipts",
      },
    ],
    seats: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Restaurants = mongoose.model("Restaurants", RestaurantSchema);
module.exports = Restaurants;
