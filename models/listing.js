const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({

    // ================= TITLE =================

    title: {
        type: String,
        required: true,
    },


    // ================= DESCRIPTION =================

    description: {
        type: String,
        required: true,
    },


    // ================= IMAGE =================

    image: {
        filename: {
            type: String,
        },

        url: {
            type: String,
        },
    },


    // ================= PRICE =================

    price: {
        type: Number,
        required: true,
    },


    // ================= LOCATION =================

    location: {
        type: String,
        required: true,
    },


    // ================= COUNTRY =================

    country: {
        type: String,
        required: true,
    },


    // ================= CATEGORY =================

    category: {
        type: String,
        enum: [
            "Trending",
            "Rooms",
            "Iconic Cities",
            "Mountains",
            "Castles",
            "Amazing Pool",
            "Camping",
            "Farms",
            "Arctic"
        ],
        default: "Trending",
    },


    // ================= MAP =================

    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },

        coordinates: {
            type: [Number],
            required: true,
        },
    },


    // ================= REVIEWS =================

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],


    // ================= OWNER =================

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

});


// ================= DELETE REVIEWS =================

listingSchema.post("findOneAndDelete", async (listing) => {

    if (listing) {

        await Review.deleteMany({
            _id: { $in: listing.reviews },
        });

    }

});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;