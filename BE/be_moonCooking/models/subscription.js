const { Schema, default: mongoose } = require("mongoose");

const SubscriptionSchema = new Schema(
  {
    subsciptionName: {
      type: String,
      required: true,
      unique: true,
    },
    subscriptionType: {
      type: String,
      required: true,
      enum: ["USER_SUBSCRIPTION", "CHEF_SUBSCRIPTION"],
    },
    price: {
      type: Number,
      required: true,
    },
    features: [
      {
        type: Schema.Types.ObjectId,
        ref: "Features",
        required: true,
      },
    ],
    available: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Subscriptions = mongoose.model("Subscriptions", SubscriptionSchema);
module.exports = Subscriptions;
