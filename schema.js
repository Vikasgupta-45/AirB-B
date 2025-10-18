const Joi = require("joi");

const ListingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().messages({
            "string.empty": "Please provide a title"
        }),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().uri().allow("", null),
            filename: Joi.string().allow("", null)
        }).optional(),
        
    }).required()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5), // `min(1)` is more appropriate for a rating
        comment: Joi.string().required().allow("", null).strict(),
    }).required(),
});

// Consolidate both exports into a single object
module.exports = { ListingSchema, reviewSchema };