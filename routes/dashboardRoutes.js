const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// Protect middleware (only logged-in users)
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "Please login first");
  res.redirect("/login");
}

// GET /dashboard
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id });

    // Complaint stats
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(c => c.status === "Pending").length;
    const resolvedComplaints = complaints.filter(c => c.status === "Resolved").length;

    res.render("userDashboard", {
      user: req.user,
      complaints,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    req.flash("error", "Unable to load dashboard");
    res.redirect("/");
  }
});

module.exports = router;

