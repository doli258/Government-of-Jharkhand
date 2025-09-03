const express = require("express");
const router = express.Router();
const multer = require("multer");
const Issue = require("../models/Issue");
const { ensureAuthenticated } = require("../utils/authGuard");

const upload = multer({ dest: "uploads/" });

// Report Issue Page
router.get("/report", ensureAuthenticated, (req, res) => {
  res.render("report-issue", { user: req.user });
});

// Report Issue Handle
router.post("/report", ensureAuthenticated, upload.single("photo"), async (req, res) => {
  const { description, latitude, longitude } = req.body;
  const issue = new Issue({
    description,
    latitude,
    longitude,
    photo: req.file ? req.file.path : null,
    reportedBy: req.user._id
  });
  await issue.save();
  req.flash("success_msg", "Issue reported successfully!");
  res.redirect("/issues/report");
});

module.exports = router;