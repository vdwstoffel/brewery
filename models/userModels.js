"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose");

// Passport will add username and password
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  reviews: [{type: Schema.Types.ObjectId, ref: "Review"}]
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
