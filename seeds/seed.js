"use strict";

const mongoose = require("mongoose");
const Brewery = require("../models/breweryModel");
const Beer = require("../models/beerModel");
const seeds = require("./seedsData");

mongoose
  .connect("mongodb://localhost:27017/breweriesDB")
  .then(() => {
    console.log("SeedsDb Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const seedDB = async () => {
  //delete contents of DB
  await Brewery.deleteMany({});
  await Beer.deleteMany({});
  //Seed the db
  for (let brewery of seeds.breweries) {
    await Brewery.create({
      name: brewery.name,
      founded: brewery.founded,
      city: brewery.city,
      country: brewery.country,
      description: brewery.description,
      logo_path: brewery.logo_path,
      website: brewery.website
    });
  }

  for (let beer of seeds.beers) {
    const foundBrewery = await Brewery.findOne({ name: beer.brewery }).exec();

    const newBeer = await Beer.create({
      name: beer.name,
      style: beer.style,
      abv: beer.abv,
      description: beer.description,
      image: beer.image,
      brewery: foundBrewery,
    });
    foundBrewery.beers.push(newBeer);
    foundBrewery.save();
  }
};

seedDB().then(() => {
  // mongoose.connection.close();
});
