const { Schema, default: mongoose } = require("mongoose");

const StepSchema = new Schema({
  stepName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  video: {
    type: String,
  },
});

const Steps = mongoose.model("Steps", StepSchema);
module.exports = Steps;
