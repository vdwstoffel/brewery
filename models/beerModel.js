"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./reviewsModel");

const BeerSchema = new Schema({
  name: String,
  style: String,
  abv: Number,
  description: String,
  image: String,
  brewery: { type: Schema.Types.ObjectId, ref: "Brewery" },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

BeerSchema.post("findOneAndDelete", async function (beer) {
  if (beer.reviews.length) {
    const output = await Review.deleteMany({ _id: { $in: beer.reviews } });
    console.trace(output);
  }
});

module.exports = mongoose.model("Beer", BeerSchema);
