const { Schema, default: mongoose } = require("mongoose");

const ReceiptSchema = new Schema(
  {
    foodName: {
      type: String,
      required: true,
    },
    createdByChef: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    rating: {
      type: [Number],
      min: 0,
      max: 5,
      default: [],
    },

    steps: [
      {
        type: Schema.Types.ObjectId,
        ref: "Steps",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Receipts = mongoose.model("Receipts", ReceiptSchema);
module.exports = Receipts;
