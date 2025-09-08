const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");
const LocalStrategy = require('passport-local').Strategy;
const  ensureAuthenticated  = require("../utils/authGuard");
const sendEmail = require("../utils/sendEmail");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get("/", (req, res) => res.render("index"));
// Register Page
router.get("/register", (req, res) => res.render("register"));



// Register Handle
router.post("/register", async (req, res) => {
  const { name, email, password, username, date, district, pincode, mobile, address } = req.body;

  try {
    const newUser = new User({ name, email, username, date, district, pincode, mobile, address });
    await User.register(newUser, password);

    // ✅ Send Welcome Email
    await sendEmail(
      email,
      "🎉 Welcome to Civic साथी",
      `Hello ${name},\n\nYour account has been successfully created. You can now log in using your credentials.\nYour Username: ${username} and Password: ${password}.\n\nRegards,\nGrievance Portal Team`
    );

    req.flash("success", "You are now registered. A confirmation email has been sent.");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error", err.message);
    res.redirect("/register");
  }
});

// Login Page
router.get("/login", (req, res) => res.render("login", { activePage: "login" }));

// Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true
  })
    (req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success", "You are logged out");
    res.redirect("/login");
  });
});







module.exports = router;