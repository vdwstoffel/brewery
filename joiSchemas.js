"use strict";

const Joi = require("joi");

module.exports.addBrewerySchema = Joi.object({
  name: Joi.string().required(),
  founded: Joi.number().integer().min(0).required(),
  country: Joi.string().required(),
});

module.exports.addBeerSchema = Joi.object({
  name: Joi.string().required(),
  style: Joi.string().required(),
  abv: Joi.number().required(),
});

module.exports.addReviewSchema = Joi.object({
  rating: Joi.number().min(0).max(5).required(),
  review: Joi.string().required(),
});
