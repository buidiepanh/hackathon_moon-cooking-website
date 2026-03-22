const { default: mongoose, Schema } = require("mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^(\+84|84|0)[35789]\d{8}$/.test(v);
        },
        message: "Invalid phone number format",
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "CHEF", "ADMIN"],
    },
    receipts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Receipts",
      },
    ],
    restaurants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Restaurants",
      },
    ],
    bookings: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Bookings",
        },
      ],
      validate: {
        validator: function (value) {
          return this.role === "USER" || !value || value.length === 0;
        },
        message: "Only USER can have bookings",
      },
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscriptions",
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Users = mongoose.model("Users", UserSchema);
module.exports = Users;
