"use strict";

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync");
const { addReviewSchema } = require("../joiSchemas");
const reviewController = require("../controllers/reviews");

const validateAddReview = (req, res, next) => {
  const { rating, review } = req.body;
  const { error } = addReviewSchema.validate({ rating, review });
  if (error) {
    throw new AppError(error, 400);
  } else {
    next();
  }
};

router.post(
  "/beers/:id/reviews",
  validateAddReview,
  wrapAsync(reviewController.postReview)
);

router.delete("/reviews/:id", wrapAsync(reviewController.deleteReview));

module.exports = router;
