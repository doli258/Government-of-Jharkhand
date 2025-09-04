require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");

const app = express();

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

// Passport Config
require("./config/passport")(passport);

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
//serving static file
app.use(express.static("public"));

// Express session
app.use(session({
  secret: "sihsecret",
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Flash
app.use(flash());
// app.use((req, res, next) => {
//    res.locals.success = req.flash('success');
//    res.locals.error = req.flash('error');
//    res.locals.user = req.user; // Make user available in all views
//    next();
// });

// Global Vars for flash messages
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// app.get("/", (req, res) => res.render("index"));

// Routes
app.use("/", require("./routes/auth"));
app.use("/issues", require("./routes/issues"));

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));