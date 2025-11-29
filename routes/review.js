const express = require("express");
// CRITICAL FIX 1: Use mergeParams to access the parent Listing ID (:id) 
const router = express.Router({ mergeParams: true }); 
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/Review.js");
const { isLoggedIn } = require("../middleware.js");
const reviewController  = require("../controllers/review.js");

const validateReview = (req,res,next)=>{
    // Rely on form field naming (review[rating], review[comment]) for validation
    // The temporary modifications to req.body are not necessary here if form fields are correct.
    let {error}= reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400,msg);
    }
    else{
        next();
    }
}


// review adding (POST /listings/:id/reviews)
router.post("/", isLoggedIn, validateReview, wrapAsync (reviewController.createReview));

// deletereviewroute (DELETE /listings/:id/reviews/:reviewId)
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.deleteReview));
module.exports = router;