
const express = require("express");
const router = express.Router();

const WrapAsync = require("../utils/WrapAsync");
const { isLogedin, isOwner, validatlisting } = require("../middelware");

const listingController = require("../controllers/listing");

const multer = require("multer");
const { storage } = require("../cloudConfig");

const upload = multer({ storage });

// IMPORTANT: Listing model import
const Listing = require("../models/listing");

// ================= INDEX & CREATE =================

router
  .route("/")
  .get(
    WrapAsync(listingController.index)
  )
  .post(
    isLogedin,
    upload.single("listing[image]"),
    validatlisting,
    WrapAsync(listingController.createListing)
  );


// ================= NEW FORM =================

router.get(
  "/new",
  isLogedin,
  listingController.renderNewForm
);



// ================= SEARCH =================
// Search route must be BEFORE /:id

router.get("/search", async (req, res) => {

  const { location } = req.query;

  const allListings = await Listing.find({
    location: {
      $regex: location,
      $options: "i"
    }
  });

  // If destination does not exist
  if (allListings.length === 0) {
    return res.render("listings/index.ejs", {
      allListings: [],
      searchMessage: `Destination "${location}" does not exist.`
    });
  }

  // If destination exists
  res.render("listings/index.ejs", {
    allListings,
    searchMessage: null
  });

});

// ================= SHOW, UPDATE & DELETE =================

router
  .route("/:id")
  .get(
    WrapAsync(listingController.showListing)
  )
  .put(
    isLogedin,
    isOwner,
    upload.single("listing[image]"),
    validatlisting,
    WrapAsync(listingController.updateListing)
  )
  .delete(
    isLogedin,
    isOwner,
    WrapAsync(listingController.deleteListing)
  );


// ================= EDIT FORM =================

router.get(
  "/:id/edit",
  isLogedin,
  isOwner,
  WrapAsync(listingController.renderEditForm)
);


module.exports = router;

