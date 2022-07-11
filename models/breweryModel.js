"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;
const Beer = require("./beerModel");
const Review = require("./reviewsModel");

//Allows to create a virtual property 
const opts = { toJSON: { virtuals: true } };

const BrewerySchema = new Schema({
  name: String,
  founded: {
    type: Number,
  },
  address: String,
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  country: String,
  description: String,
  logo_path: String,
  website: String,
  beers: [{ type: Schema.Types.ObjectId, ref: "Beer" }],
}, opts);

//Create properties for popups
BrewerySchema.virtual("properties.popupMarkup").get(function () {
  return `<a href="breweries/${this._id}">${this.name}</a>`;
}, opts);

//If the brewery model is deleted deleted all the beer it is linked to
BrewerySchema.post("findOneAndDelete", async function (brewery) {
  if (brewery.beers.length) {
    const output = await Beer.deleteMany({ _id: { $in: brewery.beers } });
    const outputReviews = await Review.deleteMany({
      _id: { $in: brewery.beers.reviews },
    });
    console.log(brewery);
    console.trace(output);
    console.trace(outputReviews);
  }
});

module.exports = mongoose.model("Brewery", BrewerySchema);
