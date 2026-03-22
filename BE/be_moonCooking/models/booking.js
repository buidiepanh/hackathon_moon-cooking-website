const { Schema, default: mongoose } = require("mongoose");

const BookingSchema = new Schema({
  bookedBy: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  bookRestaurant: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
});

const Bookings = mongoose.model("Bookings", BookingSchema);
module.exports = Bookings;
