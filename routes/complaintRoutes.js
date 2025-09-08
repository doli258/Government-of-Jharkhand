const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const multer = require("multer");
const path = require("path");
const ensureAuthenticated = require("../utils/authGuard");
const mongoose = require("mongoose");
const complaintEmail  = require("../utils/sendEmail");

// Protect middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "Please login first");
  res.redirect("/login");
}

// ---- Multer Setup for File Uploads ----
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/complaints"); // make sure folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ---- GET: Render New Complaint Form ----
router.get("/new", ensureAuthenticated, (req, res) => {
  res.render("newComplaints");
});

// ---- POST: Save Complaint ----
router.post("/", ensureAuthenticated, upload.single("image"), async (req, res) => {
  try {
    const { title, description, category, address, latitude, longitude } = req.body;

    const newComplaint = new Complaint({
      title,
      description,
      category,
      address,
      latitude,
      longitude,
      user: req.user._id, // passport user
      image: req.file ? `/uploads/complaints/${req.file.filename}` : ""
    });

    await newComplaint.save();
    // ✅ Send Complaint Submission Email to User
    await complaintEmail(
      req.user.email,
      "📢 Complaint Submitted Successfully",
      `Hello ${req.user.name},\n\nYour complaint titled "${title}" has been successfully submitted. We will review it and get back to you shortly.\n complaint id: ${newComplaint._id} \n\nRegards,\n Civic साथी Team`
    );

    req.flash("success", "Complaint submitted successfully!");
    res.redirect("/dashboard");

  } catch (err) {
    console.error("Error saving complaint:", err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/complaints/new");
  }
});

// GET /complaints/:id
router.get("/:id", isLoggedIn, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      req.flash("error", "Invalid complaint ID");
      return res.redirect("/dashboard");
    }

    const complaint = await Complaint.findById(req.params.id).populate("user");

    if (!complaint) {
      req.flash("error", "Complaint not found");
      return res.redirect("/dashboard");
    }

    res.render("complaintDetail", { complaint });

  } catch (err) {
    console.error("Complaint detail error:", err);
    req.flash("error", "Unable to load complaint details");
    res.redirect("/dashboard");
  }
});


module.exports = router;
