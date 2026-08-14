const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");

const {
    listingSchema,
    listingUpdateSchema,
    reviewSchema
} = require("./Schema");


// =====================================================
// LOGIN MIDDLEWARE
// =====================================================

module.exports.isLogedin = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.session.redirectUrl =
            req.originalUrl;

        req.flash(
            "error",
            "You must be logged in first!"
        );

        return res.redirect("/login");
    }

    next();
};


// =====================================================
// SAVE REDIRECT URL
// =====================================================

module.exports.saveRedirectUrl = (req, res, next) => {

    if (req.session.redirectUrl) {

        res.locals.redirectUrl =
            req.session.redirectUrl;
    }

    next();
};


// =====================================================
// LISTING CREATE VALIDATION
// =====================================================

module.exports.validatlisting = (req, res, next) => {

    const { error } =
        listingSchema.validate(req.body);

    if (error) {

        let errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(
            400,
            errMsg
        );
    }

    next();
};


// =====================================================
// LISTING UPDATE VALIDATION
// =====================================================

module.exports.validatUpdateListing = (
    req,
    res,
    next
) => {

    const { error } =
        listingUpdateSchema.validate(req.body);

    if (error) {

        let errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(
            400,
            errMsg
        );
    }

    next();
};


// =====================================================
// REVIEW VALIDATION
// =====================================================

module.exports.validatReview = (req, res, next) => {

    const { error } =
        reviewSchema.validate(req.body);

    if (error) {

        let errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(
            400,
            errMsg
        );
    }

    next();
};


// =====================================================
// LISTING OWNER AUTHORIZATION
// =====================================================

module.exports.isOwner = async (
    req,
    res,
    next
) => {

    const { id } = req.params;

    const listing =
        await Listing.findById(id);


    // Listing doesn't exist

    if (!listing) {

        req.flash(
            "error",
            "Listing does not exist!"
        );

        return res.redirect(
            "/listings"
        );
    }


    // Owner check

    if (
        !listing.owner ||
        !res.locals.currUser ||
        !listing.owner.equals(
            res.locals.currUser._id
        )
    ) {

        req.flash(
            "error",
            "You are not the owner of this listing!"
        );

        return res.redirect(
            `/listings/${id}`
        );
    }

    next();
};


// =====================================================
// REVIEW AUTHOR AUTHORIZATION
// =====================================================

module.exports.isReviewAuthor = async (
    req,
    res,
    next
) => {

    const {
        id,
        reviewId
    } = req.params;

    const review =
        await Review.findById(reviewId);


    // Review doesn't exist

    if (!review) {

        req.flash(
            "error",
            "Review does not exist!"
        );

        return res.redirect(
            `/listings/${id}`
        );
    }


    // Author check

    if (
        !review.author ||
        !res.locals.currUser ||
        !review.author.equals(
            res.locals.currUser._id
        )
    ) {

        req.flash(
            "error",
            "You are not the author of this review!"
        );

        return res.redirect(
            `/listings/${id}`
        );
    }

    next();
};