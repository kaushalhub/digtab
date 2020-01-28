const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

require("../models/User");
const User = mongoose.model("users");

// Login Module

router.get("/admin", (req, res) => {
  res.render("admin");
});

// Register Module

router.get("/register", (req, res) => {
  res.render("users/register");
});

// login from Post

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Register Data Insert

router.post("/register", (req, res) => {
  let errors = [];

  if (req.body.password != req.body.cnfpassword) {
    errors.push({ text: "Password Do Not Match" });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: "Password Must Be At Least 4 Characters" });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      collagename: req.body.collagename,
      gender: req.body.gender,
      userid: req.body.userid,
      password: req.body.password,
      cnfpassword: req.body.cnfpassword
    });
  } else {
    User.find({ email: req.body.email, userid: req.body.userid }).then(user => {
      if (user) {
        req.flash(
          "error_msg",
          "Email Already Registered",
          "UserID Already Registred"
        );
        res.redirect("/users/register");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
          collagename: req.body.collagename,
          gender: req.body.gender,
          userid: req.body.userid,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "Your Are Now Member Of Our User Team"
                );
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

// lOGOUT USER

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You Are Logged Out");
  res.redirect("/users/login");
});

module.exports = router;
