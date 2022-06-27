"use strict";

const express = require("express");
const router = express.Router();
const User = require("../models/userModels");
const wrapAsync = require("../utilities/wrapAsync");
const passport = require("passport");
const userController = require("../controllers/users");

router.get("/register", userController.getRegisterUser);

router.post("/register", wrapAsync(userController.postRegisterUser));

router.get("/login", userController.getLogin);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.postLogin
);

router.get("/logout", userController.logout);

module.exports = router;
