"use strict";

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const morgan = require("morgan");
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const AppError = require("./utilities/AppError");
const breweriesRoutes = require("./routes/breweries");
const beersRoutes = require("./routes/beers");
const reviewRoutes = require("./routes/reviews");
const apiRoutes = require("./routes/api");
const userRoutes = require("./routes/users");
const User = require("./models/userModels");
const breweryModel = require("./models/breweryModel")

const app = express();
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.path("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

//session and flash
app.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
  })
);
app.use(flash());

//Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash middleware
app.use((req, res, next) => {
  if (!["/login", "/register"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl; // return to the last action after the user is logged in
  }
  res.locals.currentUser = req.user; // check if the user is currently logged in
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//Database`
//TODO: Connected to live database. Implement a live/local database
mongoose
  .connect(
    //Live DB
    // `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.7aons.mongodb.net/beerDB?retryWrites=true&w=majority`
    //Local Db
    "mongodb://localhost:27017/breweriesDB"
  )
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

//Routes
app.get("/", async (req, res) => {
  const breweries = await breweryModel.find({}).exec()
  res.render("index", { title: "Home", breweries });
});

app.use("/", breweriesRoutes);
app.use("/", beersRoutes);
app.use("/", reviewRoutes);
app.use("/", apiRoutes);
app.use("/", userRoutes);

//Error Handeling
app.all("*", (req, res, next) => {
  next(new AppError("Page does not Exist", 404));
});

app.use((err, req, res, next) => {
  const { message = "Something went wrong", status = 500 } = err;
  res.status(status).render("error", { title: status, err });
});

//Running Server
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
