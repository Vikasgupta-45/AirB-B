const express = require("express");
const router = express.Router();
// accept either export name to avoid "undefined" issues
const { listingSchema, ListingSchema, reviewSchema } = require("../schema.js");
const schemaToUse = listingSchema || ListingSchema;
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/Review.js");
const methodOverride = require('method-override');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

// NOTE: methodOverride is typically applied globally in app.js, 
// but keeping it here for completeness if that was the intention:
router.use(methodOverride('_method'));

const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");
const listingController  = require("../controllers/listings.js");
// NOTE: For production, do NOT use 'uploads/' locally; 
// use Cloudinary storage config here. Keeping dest for local testing.


const validateListing = (req, res, next) => {
    if (!schemaToUse) {
        // Clear error so you can fix schema.js exports quickly
        return next(new ExpressError(500, "Listing schema not found. Ensure schema.js exports 'listingSchema' or 'ListingSchema'."));
    }
    // If using Multer, the file data is on req.file or req.files. 
    // Validation only happens on req.body data.
    let { error } = schemaToUse.validate(req.body); 
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

const validateReview = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400,msg);
    }
    else{
        next();
    }
}

// Index Route: get all listing (with optional category filter)
router.get("/", wrapAsync(listingController.index));

// Search route MUST come before /:id routes
router.get("/search", wrapAsync(listingController.searchListings));

// New Route: render new form (must be before :id routes)
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show Route: show listing details
router.get("/:id", wrapAsync(listingController.showListing));

// CREATE Route: add a new listing (Combined the two conflicting POST routes)
router.post(
    "/", // <- CRITICAL FIX: Path string is required
    isLoggedIn,
    // Multer handles file upload and populates req.file
    upload.single('listing[image]'), 
    (req, res, next) => {
        // Debug: log file info
        // console.log("[upload-debug] req.file:", req.file ? { path: req.file.path, filename: req.file.filename } : "undefined");
        // console.log("[upload-debug] req.body.listing.image:", req.body.listing ? req.body.listing.image : "undefined");
        next();
    },
    validateListing, 
    wrapAsync(listingController.createListing)
);

// Edit Route: render edit form
router.get("/:id/edit", isLoggedIn,wrapAsync(listingController.editListing));

// Update Route: Update listing
router.put("/:id", 
    isLoggedIn,
    // Add Multer here too, in case the user updates the image
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
);

// Delete Route: delete listing
router.delete("/:id", isLoggedIn,wrapAsync(listingController.deleteListing));


module.exports = router;