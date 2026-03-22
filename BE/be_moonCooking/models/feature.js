const { Schema, default: mongoose } = require("mongoose");

const FeatureSchema = new Schema({
  featName: {
    type: String,
    required: true,
  },
  featCode: {
    type: String,
    enum: ["AI_SUGGESTION", "CREATE_RECEIPT", "CREATE_RESTAURANT"],
    required: true,
  },
  featValue: {
    type: Number,
  },
  featEnable: {
    type: Boolean,
    default: true,
  },
});

const Features = mongoose.model("Features", FeatureSchema);
module.exports = Features;
