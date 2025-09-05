const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ["Sanitation", "Roads", "Electricity", "Water", "Other"],
    required: true
  },

  image: {
    type: String, // store file path or cloud URL (like Cloudinary)
    default: ""
  },

  address: {
    type: String,
    trim: true
  },

  latitude: {
    type: Number
  },

  longitude: {
    type: Number
  },

  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  // Link complaint to a user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // For admin assignment later
  assignedDept: {
    type: String,
    default: ""
  },

  // For tracking resolution
  resolutionNote: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Complaint", complaintSchema);
