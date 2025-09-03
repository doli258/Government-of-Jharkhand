const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Register Page
router.get("/register", (req, res) => res.render("register"));

// Register Handle
router.post("/register", async (req, res) => {
  const { name, email, password, username,date } = req.body;

  try {
    const newUser = new User({ name, email, username,date });
    await User.register(newUser, password);
    req.flash("success", "You are now registered and can log in");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    errors.push({ msg: "An error occurred during registration" });
    res.render("register", {
      errors,
      name,
      email,
      password,
      username
    });
  }
  
});

// Login Page
router.get("/login", (req, res) => res.render("login", { activePage: "login" }));

// Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success_msg", "You are logged out");
    res.redirect("/login");
  });
});

module.exports = router;