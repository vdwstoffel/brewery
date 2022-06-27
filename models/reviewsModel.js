"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
    review: String,
    rating: Number,
    beer: {type: Schema.Types.ObjectId, ref: "Beer"},
    user: {type: Schema.Types.ObjectId, ref: "User"}

})

module.exports = mongoose.model("Review", reviewSchema)
