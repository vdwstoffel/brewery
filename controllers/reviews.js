"use strict";

const Beer = require("../models/beerModel");
const User = require("../models/userModels");
const Review = require("../models/reviewsModel");

module.exports.postReview = async (req, res, next) => {
  const { id } = req.params;
  const beer = await Beer.findById(id).exec();
  const user = await User.findById(req.user._id).exec();
  const { rating, review } = req.body;
  const newReview = await Review.create({
    rating: rating,
    review: review,
    beer: beer,
    user: req.user,
  });
  beer.reviews.push(newReview);
  beer.save();
  user.reviews.push(newReview);
  user.save();
  req.flash("success", "Review added");
  console.trace(req.session);
  res.redirect(`/beers/${id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id } = req.params;
  const { beerId } = req.body;
  await Review.findByIdAndDelete(id);
  req.flash("success", "Review deleted");
  res.redirect(`/beers/${beerId}`);
};
