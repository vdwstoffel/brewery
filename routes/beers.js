"use strict";

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync");
const { isLoggedIn } = require("../utilities/middleware");
const { addBeerSchema } = require("../joiSchemas");
//Controllers
const beerController = require("../controllers/beers");

const validateAddBeer = (req, res, next) => {
  const { name, style, abv, description, image } = req.body;
  const { error } = addBeerSchema.validate({ name, style, abv });
  if (error) {
    throw new AppError(error, 400);
  } else {
    next();
  }
};

router.get("/beers", beerController.getAllBeers);

router.get("/breweries/:id/beers/add", isLoggedIn, beerController.getAddBeer);

router.post(
  "/breweries/:id/beers/add",
  validateAddBeer,
  wrapAsync(beerController.postAddBeer)
);

router.get("/beers/:id", wrapAsync(beerController.getBeer));

router.get("/beers/:id/edit", wrapAsync(beerController.getEditbeer));

router.put("/beers/:id/edit", wrapAsync(beerController.putEditBeer));

router.delete("/beers/:id/delete", wrapAsync(beerController.deleteBeer));

module.exports = router;
