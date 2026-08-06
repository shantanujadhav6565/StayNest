const express = require("express");
const router = express.Router();

const WrapAsync = require("../utils/WrapAsync");
const { isLogedin, isOwner, validatlisting } = require("../middelware");

const listingController = require("../controllers/listing");

const multer = require("multer");
const { storage } = require("../cloudConfig");

const upload = multer({ storage });


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