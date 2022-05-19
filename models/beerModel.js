"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const BeerSchema = new Schema({
  name: String,
  style: String,
  abv: Number,
  description: String,
  image: String,
  brewery: {type: Schema.Types.ObjectId, ref: "Brewery"}
});

module.exports = mongoose.model("Beer", BeerSchema);
