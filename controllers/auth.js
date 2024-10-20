const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const session = require("express-session");


// MIDDLEWARE 


// BEGIN SIGN UP ROUTES

  router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
  });


router.post("/sign-up", async (req, res) => {
    console.log(req.body)
    const userInDatabase = await User.findOne({ username: req.body.username });
if (userInDatabase) {
    res.send("Username already taken.");
    return
}
if (req.body.password !== req.body.confirmPassword) {
    res.send("Password and Confirm Password must match");
    return
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
req.body.password = hashedPassword;
const user = await User.create(req.body);
res.send(`Thanks for signing up ${user.username}`)

});

// END SIGN UP ROUTES

// BEGIN SIGN IN ROUTES

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
  });

  router.post("/sign-in", async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
if (!userInDatabase) {
  return res.send("Login failed. Please try again.");
}
const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );
  if (!validPassword) {
    return res.send("Login failed. Please try again.");
  }
  req.session.user = {
    username: userInDatabase.username,
  };
    res.redirect("/");
  });
  
  // END SIGN IN ROUTES

// BEGIN SIGN OUT ROUTES

router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect("/");
  });




module.exports = router;