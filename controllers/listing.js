const Listing = require("../models/listing");
const axios = require("axios");


// ================= INDEX =================
module.exports.index = async (req, res) => {

    const allListings = await Listing.find({});

    res.render("listings/index.ejs", { allListings });

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


    if (!listing) {

        req.flash(
            "error",
            "Listing you requested does not exist!"
        );

        return res.redirect("/listings");

    }


    res.render("listings/show.ejs", {

        listing,

        // MapTiler API Key
        mapToken: process.env.MAP_TOKEN

    });

};



// ================= CREATE LISTING =================
module.exports.createListing = async (req, res) => {


    let url = req.file.path;

    let filename = req.file.filename;


    const newListing = new Listing(req.body.listing);



    // Get coordinates from MapTiler

    const response = await axios.get(

        `https://api.maptiler.com/geocoding/${encodeURIComponent(
            newListing.location
        )}.json?key=${process.env.MAP_TOKEN}`

    );


    if (!response.data.features.length) {

        req.flash(
            "error",
            "Location not found!"
        );

        return res.redirect("/listings/new");

    }



    newListing.geometry = {

        type: "Point",

        coordinates:
            response.data.features[0].geometry.coordinates

    };



    newListing.owner = req.user._id;



    newListing.image = {

        url,

        filename

    };



    await newListing.save();



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



    if (!listing) {

        req.flash(
            "error",
            "Listing you requested does not exist!"
        );

        return res.redirect("/listings");

    }



    res.render(
        "listings/edit.ejs",
        { listing }
    );


};



// ================= UPDATE LISTING =================
module.exports.updateListing = async (req, res) => {


    const { id } = req.params;


    let listing = await Listing.findById(id);



    if (!listing) {

        req.flash(
            "error",
            "Listing does not exist!"
        );

        return res.redirect("/listings");

    }



    // Update fields

    Object.assign(
        listing,
        req.body.listing
    );




    // Update coordinates

    const response = await axios.get(

        `https://api.maptiler.com/geocoding/${encodeURIComponent(
            listing.location
        )}.json?key=${process.env.MAP_TOKEN}`

    );



    if (response.data.features.length) {


        listing.geometry = {

            type: "Point",

            coordinates:
                response.data.features[0].geometry.coordinates

        };


    }




    // Update image

    if (req.file) {


        listing.image = {

            url: req.file.path,

            filename: req.file.filename

        };


    }




    await listing.save();



    req.flash(
        "success",
        "Listing Updated Successfully!"
    );



    res.redirect(`/listings/${id}`);


};




// ================= DELETE LISTING =================
module.exports.deleteListing = async (req, res) => {


    const { id } = req.params;



    await Listing.findByIdAndDelete(id);



    req.flash(
        "success",
        "Listing Deleted Successfully!"
    );



    res.redirect("/listings");


};