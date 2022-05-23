"use strict";

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const morgan = require("morgan");
require("dotenv").config();
const Brewery = require("./models/breweryModel");
const Beer = require("./models/beerModel");
const Review = require("./models/reviewsModel");
const AppError = require("./utilities/AppError");
const wrapAsync = require("./utilities/wrapAsync");
const {
  addBrewerySchema,
  addBeerSchema,
  addReviewSchema,
} = require("./joiSchemas.js");

const app = express();

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.path("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

//Database
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

//TODO: Move to seperate file // Joi schema
const validateAddBrewery = (req, res, next) => {
  const { name, founded, city, country, description, logo_path, website } =
    req.body;
  const { error } = addBrewerySchema.validate({ name, founded, country });
  if (error) {
    throw new AppError(error, 400);
  } else {
    next();
  }
};

const validateAddBeer = (req, res, next) => {
  const { name, style, abv, description, image } = req.body;
  const { error } = addBeerSchema.validate({ name, style, abv });
  if (error) {
    throw new AppError(error, 400);
  } else {
    next();
  }
};

const validateAddReview = (req, res, next) => {
  const { rating, review } = req.body;
  const { error } = addReviewSchema.validate({ rating, review });
  if (error) {
    throw new AppError(error, 400);
  } else {
    next();
  }
};

//Routes
app.get("/", (req, res) => {
  res.redirect("/breweries");
});

//breweries
app.get(
  "/breweries",
  wrapAsync(async (req, res, next) => {
    const breweries = await Brewery.find({}).sort("name");
    res.render("breweries/index", { breweries, title: "Breweries" });
  })
);

app.get("/breweries/add", (req, res) => {
  res.render("breweries/addBrewery", { title: "Add Brewery" });
});

app.post(
  "/breweries/add",
  validateAddBrewery,
  wrapAsync(async (req, res, next) => {
    const { name, founded, city, country, description, logo_path, website } =
      req.body;

    const newBrewery = await Brewery.create({
      name: name,
      founded: founded,
      city: city,
      country: country,
      description: description,
      logo_path: logo_path,
      website: website,
    });
    res.redirect(`/breweries/${newBrewery._id}`);
  })
);

app.get(
  "/breweries/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const brewery = await Brewery.findById(id).populate("beers");
    if (!brewery) {
      console.trace("Brewery Not found");
      throw new AppError("Product Not Found", 404);
    }
    res.render("breweries/brewery", { brewery, title: brewery.name });
  })
);

app.get(
  "/breweries/:id/edit",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const brewery = await Brewery.findById(id);
    if (!brewery) {
      throw new AppError("Product Not Found", 404);
    }
    res.render("breweries/editBrewery", { brewery, title: "Edit brewery" });
  })
);

app.put("/breweries/:id/edit", (req, res) => {
  const { id } = req.params;
  const { name, founded, city, country, description, logo_path, website } =
    req.body;
  Brewery.findByIdAndUpdate(
    id,
    {
      name: name,
      founded: founded,
      city: city,
      country: country,
      description: description,
      logo_path: logo_path,
      website: website,
    },
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  res.redirect(`/breweries/${id}`);
});

app.delete("/breweries/:id/delete", (req, res) => {
  const { id } = req.params;
  Brewery.findByIdAndDelete(id, (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/breweries");
});

app.get("/breweries/test", (err, req, res, next) => {
  console.log(err);
  const { message, status } = err;
  res.status(status).send(`Error ${message}`);
});

//API
app.get("/rest/breweries/all", async (req, res) => {
  const breweries = await Brewery.find({}).select({
    _id: 0,
    name: 1,
    founded: 1,
    city: 1,
    country: 1,
    description: 1,
    logo_path: 1,
    website: 1,
  });
  res.send(breweries);
});

//beers
app.get("/beers", async (req, res) => {
  const beers = await Beer.find({}).populate("brewery");
  //Iterate throught the list of beers to create a list with all the different styles
  const styles = [];
  for (let beer of beers) {
    if (!styles.includes(beer.style)) {
      styles.push(beer.style);
    }
  }
  res.render("beers/index", { title: "Beers", beers, styles: styles.sort() });
});

app.get("/breweries/:id/beers/add", async (req, res) => {
  const { id } = req.params;
  res.render("beers/addBeer", { title: "Add Beer", id });
});

app.post(
  "/breweries/:id/beers/add",
  validateAddBeer,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, style, abv, description, image } = req.body;
    //Check first if there is a brewery before adding the beers to the db
    const findBrewery = await Brewery.findById(id).exec();
    if (!findBrewery) {
      throw new AppError("The Brewery does not exist", 400);
    }
    const newBeer = await Beer.create({
      name: name,
      style: style,
      abv: abv,
      description: description,
      image: image,
      brewery: findBrewery,
    });
    findBrewery.beers.push(newBeer);
    findBrewery.save();
    res.redirect("/breweries");
  })
);

app.get(
  "/beers/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const beer = await Beer.findById(id).populate("brewery").populate("reviews");
    res.render("beers/beer", { beer, title: beer.name });
  })
);

app.get(
  "/beers/:id/edit",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const beer = await Beer.findById(id).populate("brewery");
    res.render("beers/editBeer", { title: "Edit Beer", beer });
  })
);

app.put(
  "/beers/:id/edit",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, style, abv, description, image, brewery } = req.body;
    console.trace(brewery);
    Beer.findByIdAndUpdate(
      id,
      {
        name: name,
        style: style,
        abv: abv,
        description: description,
        image: image,
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
    res.redirect(`/beers/${id}`);
  })
);

app.delete(
  "/beers/:id/delete",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Beer.findByIdAndDelete(id);
    res.redirect("/beers");
  })
);

//Beer API
app.get(
  "/rest/beers/all",
  wrapAsync(async (req, res, next) => {
    const beer = await Beer.find({}).select({
      _id: 0,
      name: 1,
      style: 1,
      abv: 1,
      description: 1,
      image: 1,
      brewery: 1,
    });
    res.send(beer);
  })
);

//Reviews routes
app.post(
  "/beers/:id/reviews",
  validateAddReview,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const beer = await Beer.findById(id).exec();
    const { rating, review } = req.body;
    const newReview = await Review.create({ rating: rating, review: review, beer: beer });
    beer.reviews.push(newReview);
    beer.save()
    res.redirect(`/beers/${id}`);
  })
);

app.delete("/reviews/:id", wrapAsync (async (req, res, nextg) => {
  const {id} = req.params
  const {beerId} = req.body
  await Review.findByIdAndDelete(id)
  res.redirect(`/beers/${beerId}`)
}))

//Error Handeling
app.all("*", (req, res, next) => {
  next(new AppError("Page does not Exist", 404));
});

app.use((err, req, res, next) => {
  const { message = "Something went wrong", status = 500 } = err;
  res.status(status).render("error", { title: status, err });
});

//Running Server
let port = process.env.PORT;
app.listen(port, () => {
  if (port === null || port === "") {
    port = 3000;
  }
  console.log(`Server running on port ${port}`);
});
