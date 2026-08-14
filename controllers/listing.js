const Listing = require("../models/listing");
const axios = require("axios");


// ======================================================
// INDEX
// ======================================================

module.exports.index = async (req, res) => {

    try {

        const { category } = req.query;

        let allListings;


        // ==================================================
        // CATEGORY FILTER
        // ==================================================

        if (category) {

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

            // ==================================================
            // ALL LISTINGS
            // ==================================================

            allListings = await Listing.aggregate([

                {
                    $sample: {
                        size: 100
                    }
                }

            ]);

        }


        // ==================================================
        // CATEGORY MESSAGE
        // ==================================================

        let categoryMessage = null;


        if (
            category &&
            allListings.length === 0
        ) {

            categoryMessage =
                `No listings found in ${category}.`;

        }


        // ==================================================
        // RENDER
        // ==================================================

        res.render(
            "listings/index.ejs",
            {
                allListings,
                searchMessage: null,
                categoryMessage
            }
        );

    } catch (err) {

        console.error(
            "INDEX ERROR:",
            err
        );

        req.flash(
            "error",
            "Unable to load listings."
        );

        res.redirect("/listings");

    }

};



// ======================================================
// RENDER NEW FORM
// ======================================================

module.exports.renderNewForm = (req, res) => {

    res.render(
        "listings/new.ejs"
    );

};



// ======================================================
// SHOW LISTING
// ======================================================

module.exports.showListing = async (req, res) => {

    try {

        const { id } = req.params;


        const listing = await Listing.findById(id)

            .populate({
                path: "reviews",

                populate: {
                    path: "author"
                }
            })

            .populate("owner");


        // ==================================================
        // LISTING NOT FOUND
        // ==================================================

        if (!listing) {

            req.flash(
                "error",
                "Listing you requested does not exist!"
            );

            return res.redirect(
                "/listings"
            );

        }


        // ==================================================
        // SHOW PAGE
        // ==================================================

        res.render(
            "listings/show.ejs",
            {
                listing,
                mapToken: process.env.MAP_TOKEN
            }
        );

    } catch (err) {

        console.error(
            "SHOW LISTING ERROR:",
            err
        );

        req.flash(
            "error",
            "Unable to open listing."
        );

        res.redirect(
            "/listings"
        );

    }

};



// ======================================================
// CREATE LISTING
// ======================================================

module.exports.createListing = async (req, res) => {

    try {


        // ==================================================
        // CHECK USER
        // ==================================================

        if (!req.user) {

            req.flash(
                "error",
                "You must be logged in first!"
            );

            return res.redirect(
                "/login"
            );

        }


        // ==================================================
        // CHECK IMAGE
        // ==================================================

        if (!req.file) {

            req.flash(
                "error",
                "Please upload an image for your listing."
            );

            return res.redirect(
                "/listings/new"
            );

        }


        // ==================================================
        // CHECK MAP TOKEN
        // ==================================================

        if (!process.env.MAP_TOKEN) {

            console.error(
                "MAP_TOKEN is missing."
            );

            req.flash(
                "error",
                "Map service is not configured."
            );

            return res.redirect(
                "/listings/new"
            );

        }


        // ==================================================
        // CREATE LISTING OBJECT
        // ==================================================

        const newListing = new Listing(
            req.body.listing
        );


        // ==================================================
        // CHECK LOCATION
        // ==================================================

        if (!newListing.location) {

            req.flash(
                "error",
                "Please enter a location."
            );

            return res.redirect(
                "/listings/new"
            );

        }


        // ==================================================
        // CHECK CATEGORY
        // ==================================================

        if (!newListing.category) {

            req.flash(
                "error",
                "Category is required."
            );

            return res.redirect(
                "/listings/new"
            );

        }


        // ==================================================
        // MAPTILER GEOCODING
        // ==================================================

        const response = await axios.get(

            `https://api.maptiler.com/geocoding/${encodeURIComponent(
                newListing.location
            )}.json?key=${process.env.MAP_TOKEN}`

        );


        // ==================================================
        // CHECK MAPTILER RESPONSE
        // ==================================================

        if (
            !response.data ||
            !response.data.features ||
            response.data.features.length === 0
        ) {

            req.flash(
                "error",
                "Location not found. Please enter a valid location."
            );

            return res.redirect(
                "/listings/new"
            );

        }


        // ==================================================
        // SET GEOMETRY
        // ==================================================

        newListing.geometry = {

            type: "Point",

            coordinates:
                response.data.features[0]
                    .geometry
                    .coordinates

        };


        // ==================================================
        // SET OWNER
        // ==================================================

        newListing.owner =
            req.user._id;


        // ==================================================
        // SET IMAGE
        // ==================================================

        newListing.image = {

            url: req.file.path,

            filename: req.file.filename

        };


        // ==================================================
        // SAVE LISTING
        // ==================================================

        await newListing.save();


        // ==================================================
        // SUCCESS
        // ==================================================

        req.flash(
            "success",
            "New Listing Created Successfully!"
        );


        return res.redirect(
            "/listings"
        );


    } catch (err) {

        console.error(
            "======================================"
        );

        console.error(
            "CREATE LISTING ERROR:"
        );

        console.error(err);

        console.error(
            "======================================"
        );


        req.flash(
            "error",
            "Unable to create listing. Please try again."
        );


        return res.redirect(
            "/listings/new"
        );

    }

};



// ======================================================
// RENDER EDIT FORM
// ======================================================

module.exports.renderEditForm = async (req, res) => {

    try {

        const { id } = req.params;


        const listing =
            await Listing.findById(id);


        // ==================================================
        // NOT FOUND
        // ==================================================

        if (!listing) {

            req.flash(
                "error",
                "Listing you requested does not exist!"
            );

            return res.redirect(
                "/listings"
            );

        }


        // ==================================================
        // RENDER EDIT
        // ==================================================

        res.render(
            "listings/edit.ejs",
            {
                listing
            }
        );

    } catch (err) {

        console.error(
            "EDIT FORM ERROR:",
            err
        );

        req.flash(
            "error",
            "Unable to open edit page."
        );

        res.redirect(
            "/listings"
        );

    }

};



// ======================================================
// UPDATE LISTING
// ======================================================

module.exports.updateListing = async (req, res) => {

    try {

        const { id } =
            req.params;


        const listing =
            await Listing.findById(id);


        // ==================================================
        // LISTING NOT FOUND
        // ==================================================

        if (!listing) {

            req.flash(
                "error",
                "Listing does not exist!"
            );

            return res.redirect(
                "/listings"
            );

        }


        // ==================================================
        // CHECK REQUEST BODY
        // ==================================================

        if (
            !req.body ||
            !req.body.listing
        ) {

            req.flash(
                "error",
                "No listing data received."
            );

            return res.redirect(
                `/listings/${id}/edit`
            );

        }


        // ==================================================
        // CHECK CATEGORY
        // ==================================================

        if (
            !req.body.listing.category ||
            req.body.listing.category.trim() === ""
        ) {

            req.flash(
                "error",
                "Category is required."
            );

            return res.redirect(
                `/listings/${id}/edit`
            );

        }


        // ==================================================
        // UPDATE BASIC FIELDS
        // ==================================================

        Object.assign(
            listing,
            req.body.listing
        );


        // ==================================================
        // UPDATE LOCATION
        // ==================================================

        if (
            listing.location &&
            process.env.MAP_TOKEN
        ) {

            const response =
                await axios.get(

                    `https://api.maptiler.com/geocoding/${encodeURIComponent(
                        listing.location
                    )}.json?key=${process.env.MAP_TOKEN}`

                );


            // ==================================================
            // UPDATE GEOMETRY
            // ==================================================

            if (
                response.data &&
                response.data.features &&
                response.data.features.length > 0
            ) {

                listing.geometry = {

                    type: "Point",

                    coordinates:
                        response.data
                            .features[0]
                            .geometry
                            .coordinates

                };

            }

        }


        // ==================================================
        // UPDATE IMAGE
        // ==================================================

        if (req.file) {

            listing.image = {

                url: req.file.path,

                filename: req.file.filename

            };

        }


        // ==================================================
        // SAVE
        // ==================================================

        await listing.save();


        // ==================================================
        // SUCCESS
        // ==================================================

        req.flash(
            "success",
            "Listing Updated Successfully!"
        );


        return res.redirect(
            `/listings/${id}`
        );


    } catch (err) {

        console.error(
            "======================================"
        );

        console.error(
            "UPDATE LISTING ERROR:"
        );

        console.error(err);

        console.error(
            "======================================"
        );


        req.flash(
            "error",
            "Unable to update listing."
        );


        return res.redirect(
            `/listings/${req.params.id}/edit`
        );

    }

};



// ======================================================
// DELETE LISTING
// ======================================================

module.exports.deleteListing = async (req, res) => {

    try {

        const { id } =
            req.params;


        // ==================================================
        // CHECK LISTING
        // ==================================================

        const listing =
            await Listing.findById(id);


        if (!listing) {

            req.flash(
                "error",
                "Listing does not exist!"
            );

            return res.redirect(
                "/listings"
            );

        }


        // ==================================================
        // DELETE
        // ==================================================

        await Listing.findByIdAndDelete(
            id
        );


        // ==================================================
        // SUCCESS
        // ==================================================

        req.flash(
            "success",
            "Listing Deleted Successfully!"
        );


        return res.redirect(
            "/listings"
        );


    } catch (err) {

        console.error(
            "DELETE LISTING ERROR:",
            err
        );


        req.flash(
            "error",
            "Unable to delete listing."
        );


        return res.redirect(
            "/listings"
        );

    }

};