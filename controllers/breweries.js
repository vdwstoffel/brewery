"use strict";

const Brewery = require("../models/breweryModel");

module.exports.getAllBreweries = async (req, res, next) => {
  const breweries = await Brewery.find({}).sort("name");
  res.render("breweries/index", { breweries, title: "Breweries" });
};

module.exports.getAddBrewery = (req, res) => {
  res.render("breweries/addBrewery", { title: "Add Brewery" });
};

module.exports.postAddBrewery = async (req, res, next) => {
  const { name, founded, city, country, description, logo_path, website } =
    req.body;
  const newBrewery = await Brewery.create({
    name: name,
    founded: founded,
    city: city,
    country: country,
    description: description,
    logo_path: logo_path,
    website: website,
  });
  res.redirect(`/breweries/${newBrewery._id}`);
};

module.exports.getBrewery = async (req, res, next) => {
  const { id } = req.params;
  const brewery = await Brewery.findById(id).populate("beers");
  if (!brewery) {
    // throw new AppError("Product Not Found", 404);
    req.flash("error", "The brewery you are looking for does not exist");
    res.redirect("/breweries");
  }
  res.render("breweries/brewery", { brewery, title: brewery.name });
};

module.exports.getEditBreweries = async (req, res, next) => {
  const { id } = req.params;
  const brewery = await Brewery.findById(id);
  if (!brewery) {
    // throw new AppError("Product Not Found", 404);
    req.flash("error", "The brewery you are looking for does not exists");
    res.redirect("/breweries");
  }
  res.render("breweries/editBrewery", { brewery, title: "Edit brewery" });
};

module.exports.putEditbreweries = (req, res) => {
  const { id } = req.params;
  const { name, founded, city, country, description, logo_path, website } =
    req.body;
  Brewery.findByIdAndUpdate(
    id,
    {
      name: name,
      founded: founded,
      city: city,
      country: country,
      description: description,
      logo_path: logo_path,
      website: website,
    },
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  req.flash("success", `Edited succesfully`);
  res.redirect(`/breweries/${id}`);
};

module.exports.deleteBrewery = (req, res) => {
  const { id } = req.params;
  Brewery.findByIdAndDelete(id, (err) => {
    if (err) {
      console.log(err);
    }
  });
  req.flash("success", "Brewery successfully deleted");
  res.redirect("/breweries");
};
