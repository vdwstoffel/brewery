"use strict";

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Please Log in");
    return res.redirect("/login");
  } else {
      next()
  }
};
