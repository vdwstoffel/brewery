"use strict";

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync");
const AppError = require("../utilities/AppError");
const { isLoggedIn } = require("../utilities/middleware");
const { addBrewerySchema } = require("../joiSchemas");
const breweriesController = require("../controllers/breweries");

const validateAddBrewery = (req, res, next) => {
  const { name, founded, city, country, description, logo_path, website } =
    req.body;
  const { error } = addBrewerySchema.validate({ name, founded, country });
  if (error) {
    throw new AppError(error, 400);
  } else {
    next();
  }
};

//routes
router.get("/breweries", wrapAsync(breweriesController.getAllBreweries));

router.get("/breweries/add", isLoggedIn, breweriesController.getAddBrewery);

router.post(
  "/breweries/add",
  isLoggedIn,
  validateAddBrewery,
  wrapAsync(breweriesController.postAddBrewery)
);

router.get("/breweries/:id", wrapAsync(breweriesController.getBrewery));

router.get(
  "/breweries/:id/edit",
  isLoggedIn,
  wrapAsync(breweriesController.getEditBreweries)
);

router.put(
  "/breweries/:id/edit",
  isLoggedIn,
  breweriesController.putEditbreweries
);

router.delete(
  "/breweries/:id/delete",
  isLoggedIn,
  breweriesController.deleteBrewery
);

module.exports = router;
