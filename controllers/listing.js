const Listing = require("../models/listing");
const axios = require("axios");

// ================= INDEX =================

module.exports.index = async (req, res) => {

    const { category } = req.query;

    let allListings;

    // ================= CATEGORY FILTER =================

    if (category) {

        // Filtered listings + RANDOM ORDER
        allListings = await Listing.aggregate([
            {
                $match: {
                    category: category
                }
            },
            {
                $sample: {
                    size: 100
                }
            }
        ]);

    } else {

        // All listings + RANDOM ORDER
        allListings = await Listing.aggregate([
            {
                $sample: {
                    size: 100
                }
            }
        ]);

    }

    // ================= CATEGORY MESSAGE =================

    let categoryMessage = null;

    if (category && allListings.length === 0) {

        categoryMessage = `No listings found in ${category}.`;

    }

    // ================= RENDER INDEX =================

    res.render("listings/index.ejs", {

        allListings,

        // Search message default
        searchMessage: null,

        // Category message
        categoryMessage

    });

};


// ================= RENDER NEW FORM =================

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");

};


// ================= SHOW LISTING =================

module.exports.showListing = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");


    // ================= LISTING NOT FOUND =================

    if (!listing) {

        req.flash(
            "error",
            "Listing you requested does not exist!"
        );

        return res.redirect("/listings");

    }


    // ================= SHOW PAGE =================

    res.render("listings/show.ejs", {

        listing,

        // MapTiler API Key
        mapToken: process.env.MAP_TOKEN

    });

};


// ================= CREATE LISTING =================

module.exports.createListing = async (req, res) => {

    // ================= IMAGE =================

    let url = req.file.path;

    let filename = req.file.filename;


    // ================= CREATE LISTING =================

    const newListing = new Listing(req.body.listing);


    // ================= GET COORDINATES FROM MAPTILER =================

    const response = await axios.get(

        `https://api.maptiler.com/geocoding/${encodeURIComponent(
            newListing.location
        )}.json?key=${process.env.MAP_TOKEN}`

    );


    // ================= LOCATION NOT FOUND =================

    if (!response.data.features.length) {

        req.flash(
            "error",
            "Location not found!"
        );

        return res.redirect("/listings/new");

    }


    // ================= GEOMETRY =================

    newListing.geometry = {

        type: "Point",

        coordinates:
            response.data.features[0].geometry.coordinates

    };


    // ================= OWNER =================

    newListing.owner = req.user._id;


    // ================= IMAGE =================

    newListing.image = {

        url,

        filename

    };


    // ================= SAVE =================

    await newListing.save();


    // ================= SUCCESS MESSAGE =================

    req.flash(
        "success",
        "New Listing Created Successfully!"
    );


    res.redirect("/listings");

};


// ================= RENDER EDIT FORM =================

module.exports.renderEditForm = async (req, res) => {

    const { id } = req.params;


    const listing = await Listing.findById(id);


    // ================= LISTING NOT FOUND =================

    if (!listing) {

        req.flash(
            "error",
            "Listing you requested does not exist!"
        );

        return res.redirect("/listings");

    }


    // ================= EDIT PAGE =================

    res.render(
        "listings/edit.ejs",
        {
            listing
        }
    );

};


// ================= UPDATE LISTING =================

module.exports.updateListing = async (req, res) => {

    const { id } = req.params;


    let listing = await Listing.findById(id);


    // ================= LISTING NOT FOUND =================

    if (!listing) {

        req.flash(
            "error",
            "Listing does not exist!"
        );

        return res.redirect("/listings");

    }


    // ================= UPDATE FIELDS =================

    Object.assign(
        listing,
        req.body.listing
    );


    // ================= UPDATE COORDINATES =================

    const response = await axios.get(

        `https://api.maptiler.com/geocoding/${encodeURIComponent(
            listing.location
        )}.json?key=${process.env.MAP_TOKEN}`

    );


    // ================= UPDATE GEOMETRY =================

    if (response.data.features.length) {

        listing.geometry = {

            type: "Point",

            coordinates:
                response.data.features[0].geometry.coordinates

        };

    }


    // ================= UPDATE IMAGE =================

    if (req.file) {

        listing.image = {

            url: req.file.path,

            filename: req.file.filename

        };

    }


    // ================= SAVE UPDATED LISTING =================

    await listing.save();


    // ================= SUCCESS MESSAGE =================

    req.flash(
        "success",
        "Listing Updated Successfully!"
    );


    res.redirect(`/listings/${id}`);

};


// ================= DELETE LISTING =================

module.exports.deleteListing = async (req, res) => {

    const { id } = req.params;


    // ================= DELETE =================

    await Listing.findByIdAndDelete(id);


    // ================= SUCCESS MESSAGE =================

    req.flash(
        "success",
        "Listing Deleted Successfully!"
    );


    res.redirect("/listings");

};