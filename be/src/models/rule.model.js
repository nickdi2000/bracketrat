const mongoose = require("mongoose");

const rulesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  criteria: {
    type: [String],
    enum: ["head-to-head", "total-points", "random"],
    required: true,
  },
});

const Rule = mongoose.model("Rule", rulesSchema);
module.exports = Rule;
