"use strict";

const User = require("../models/userModels");

module.exports.getRegisterUser = (req, res) => {
  res.render("users/register", { title: "Register" });
};

module.exports.postRegisterUser = async (req, res, err) => {
  try {
    const { email, username, password } = req.body;
    const newUser = new User({ email: email, username: username });
    await newUser.setPassword(password);
    await newUser.save();
    // Log in the user after registration
    req.login(newUser, (err) => {
      if (err) return next(err);
      req.flash("success", "User Created");
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.getLogin = (req, res) => {
  res.render("users/login", { title: "Log In" });
};

module.exports.postLogin = 
  (req, res) => {
    req.flash("success", `Hi ${req.user.username}`);
    //check if the user was on a previous page before log in otherwise go to home
    const redirectUrl = req.session.returnTo || "/";
    res.redirect(redirectUrl);
  };

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "Logged Out");
  res.redirect("/");
};
