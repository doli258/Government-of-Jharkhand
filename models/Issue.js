const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
  description: { type: String, required: true },
  photo: { type: String }, // store path/URL
  latitude: Number,
  longitude: Number,
  status: { type: String, enum: ["pending", "in-progress", "resolved"], default: "pending" },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Issue", IssueSchema);