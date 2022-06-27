"use strict";

const AppError = require("../utilities/AppError");
const Beer = require("../models/beerModel");
const Brewery = require("../models/breweryModel");

module.exports.getAllBeers = async (req, res) => {
  const beers = await Beer.find({}).populate("brewery");
  //Iterate throught the list of beers to create a list with all the different styles
  const styles = [];
  for (let beer of beers) {
    if (!styles.includes(beer.style)) {
      styles.push(beer.style);
    }
  }
  res.render("beers/index", { title: "Beers", beers, styles: styles.sort() });
};

module.exports.getAddBeer = async (req, res) => {
  const { id } = req.params;
  res.render("beers/addBeer", { title: "Add Beer", id });
};

module.exports.postAddBeer = async (req, res, next) => {
  const { id } = req.params;
  const { name, style, abv, description, image } = req.body;
  //Check first if there is a brewery before adding the beers to the db
  const findBrewery = await Brewery.findById(id).exec();
  if (!findBrewery) {
    throw new AppError("The Brewery does not exist", 400);
  }
  const newBeer = await Beer.create({
    name: name,
    style: style,
    abv: abv,
    description: description,
    image: image,
    brewery: findBrewery,
  });
  findBrewery.beers.push(newBeer);
  findBrewery.save();
  req.flash("success", `${newBeer.name} was added`);
  res.redirect("/beers");
};

module.exports.getBeer = async (req, res, next) => {
  const { id } = req.params;
  const beer = await Beer.findById(id).populate("brewery").populate("reviews");
  //TODO: Also display the username of the user id
  if (!beer) {
    req.flash("error", "The beer you are looking for does not exist");
    res.redirect("/beers");
  }
  res.render("beers/beer", { beer, title: beer.name });
};

module.exports.getEditbeer = async (req, res, next) => {
  const { id } = req.params;
  const beer = await Beer.findById(id).populate("brewery");
  res.render("beers/editBeer", { title: "Edit Beer", beer });
};

module.exports.putEditBeer = async (req, res, next) => {
  const { id } = req.params;
  const { name, style, abv, description, image, brewery } = req.body;
  Beer.findByIdAndUpdate(
    id,
    {
      name: name,
      style: style,
      abv: abv,
      description: description,
      image: image,
    },
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  req.flash("success", "Edit Succesfull");
  res.redirect(`/beers/${id}`);
};

module.exports.deleteBeer = async (req, res, next) => {
  const { id } = req.params;
  await Beer.findByIdAndDelete(id);
  res.redirect("/beers");
};
