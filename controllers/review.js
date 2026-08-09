const Listing = require("../models/listing");
const Review = require("../models/review");


// ================= CREATE REVIEW =================
module.exports.createReview = async (req, res) => {

    const listing = await Listing.findById(req.params.id);


    const newReview = new Review(req.body.review);


    // Logged-in user becomes review author
    newReview.author = req.user._id;



    await newReview.save();


    // Add review reference to listing
    listing.reviews.push(newReview);


    await listing.save();



    req.flash("success", "New Review Created!");


    res.redirect(`/listings/${listing._id}`);
};




// ================= DELETE REVIEW =================
module.exports.deleteReview = async (req, res) => {

    const { id, reviewId } = req.params;



    await Listing.findByIdAndUpdate(id, {

        $pull: {
            reviews: reviewId
        }

    });



    await Review.findByIdAndDelete(reviewId);



    req.flash("success", "Review Deleted!");


    res.redirect(`/listings/${id}`);
};