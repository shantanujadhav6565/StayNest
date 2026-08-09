const express = require("express");
const router = express.Router({ mergeParams: true });

const WrapAsync = require("../utils/WrapAsync");

const {
    validatReview,
    isLogedin,
    isReviewAuthor,
} = require("../middelware");

const reviewController = require("../controllers/review");

// ================= CREATE REVIEW =================
router
    .route("/")
    .post(
        isLogedin,
        validatReview,
        WrapAsync(reviewController.createReview)
    );

// ================= DELETE REVIEW =================
router
    .route("/:reviewId")
    .delete(
        isLogedin,
        isReviewAuthor,
        WrapAsync(reviewController.deleteReview)
    );

module.exports = router;