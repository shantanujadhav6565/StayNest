const Joi = require("joi");

// =====================================================
// LISTING VALIDATION
// =====================================================

module.exports.listingSchema = Joi.object({

    listing: Joi.object({

        // ================= TITLE =================

        title: Joi.string()
            .trim()
            .required()
            .messages({
                "string.empty": "Title is required",
                "any.required": "Title is required"
            }),


        // ================= DESCRIPTION =================

        description: Joi.string()
            .trim()
            .required()
            .messages({
                "string.empty": "Description is required",
                "any.required": "Description is required"
            }),


        // ================= PRICE =================

        price: Joi.number()
            .required()
            .min(0)
            .messages({
                "number.base": "Price must be a number",
                "number.min": "Price cannot be negative",
                "any.required": "Price is required"
            }),


        // ================= LOCATION =================

        location: Joi.string()
            .trim()
            .required()
            .messages({
                "string.empty": "Location is required",
                "any.required": "Location is required"
            }),


        // ================= COUNTRY =================

        country: Joi.string()
            .trim()
            .required()
            .messages({
                "string.empty": "Country is required",
                "any.required": "Country is required"
            }),


        // ================= CATEGORY =================

        category: Joi.string()
            .valid(
                "Trending",
                "Rooms",
                "Iconic Cities",
                "Mountains",
                "Castles",
                "Amazing Pool",
                "Camping",
                "Farms",
                "Arctic"
            )
            .required()
            .messages({
                "any.only": "Please select a valid category",
                "any.required": "Category is required"
            }),


        // ================= IMAGE =================

        image: Joi.object({

            url: Joi.string()
                .allow("", null),

            filename: Joi.string()
                .allow("", null)

        }).allow(null, "")

    }).required()

});


// =====================================================
// REVIEW VALIDATION
// =====================================================

module.exports.reviewSchema = Joi.object({

    review: Joi.object({

        // ================= RATING =================

        rating: Joi.number()
            .required()
            .min(1)
            .max(5)
            .messages({
                "number.base": "Rating must be a number",
                "number.min": "Rating must be at least 1",
                "number.max": "Rating cannot be more than 5",
                "any.required": "Rating is required"
            }),


        // ================= COMMENT =================

        comment: Joi.string()
            .trim()
            .required()
            .messages({
                "string.empty": "Comment is required",
                "any.required": "Comment is required"
            })

    }).required()

});