"use strict";

const mongoose = require("mongoose");
const Beer = require("./beerModel")
const { Schema } = mongoose;

const BrewerySchema = new Schema({
  name: String,
  founded: {
    type: Number,
  },
  city: String,
  country: String,
  description: String,
  logo_path: String,
  website: String,
  beers: [{ type: Schema.Types.ObjectId, ref: "Beer" }],
});

//If the brewery model is deleted deleted all the beer it is linked to
BrewerySchema.post("findOneAndDelete", async function (brewery) {
  if (brewery.beers.length) {
    const output = await Beer.deleteMany({_id: {$in: brewery.beers}})
    console.trace(output)
  }

})

module.exports = mongoose.model("Brewery", BrewerySchema);
