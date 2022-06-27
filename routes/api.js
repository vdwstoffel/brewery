"use strict";

const express = require("express");
const router = express.Router();

const wrapAsync = require("../utilities/wrapAsync");
const Beer = require("../models/beerModel");
const Brewery = require("../models/breweryModel");

//Breweries
router.get(
  "/rest/beers/all",
  wrapAsync(async (req, res, next) => {
    const beer = await Beer.find({}).select({
      _id: 0,
      name: 1,
      style: 1,
      abv: 1,
      description: 1,
      image: 1,
      brewery: 1,
    });
    res.send(beer);
  })
);

router.get(
  "/rest/beers",
  wrapAsync(async (req, res) => {
    const { style } = req.query;
    const foundBeer = await Beer.find({ style: style })
      .populate("brewery")
      .populate("reviews")
      .exec();
    if (!foundBeer.length) {
      res.send({ Error: "No such style exists" });
    }
    res.send(foundBeer);
  })
);

//Breweries
router.get("/rest/breweries/all", async (req, res) => {
  const breweries = await Brewery.find({}).select({
    _id: 0,
    name: 1,
    founded: 1,
    city: 1,
    country: 1,
    description: 1,
    logo_path: 1,
    website: 1,
  });
  res.send(breweries);
});

router.get(
  "/rest/breweries",
  wrapAsync(async (req, res, next) => {
    const { country } = req.query;
    const foundBrewery = await Brewery.find({ country: country }).populate("beers").exec();
    res.send(foundBrewery);
  })
);

module.exports = router; 
