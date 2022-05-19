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
  abv: Joi.number().required()
})
