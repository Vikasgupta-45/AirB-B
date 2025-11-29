const Listing = require("../models/listing.js");
const Review = require("../models/Review.js");

module.exports.createReview = async (req,res,next)=>{
    const listing = await Listing.findById(req.params.id); // req.params.id is available due to mergeParams
    
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }
    
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
 
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    
    req.flash("success", "New review added!");
    res.redirect(`/listings/${listing._id}`);
}
module.exports.deleteReview = async (req, res) => {
    // id = Listing ID, reviewId = Review ID
      const { id, reviewId } = req.params;
      
    // Fetch review to check authorization
      const review = await Review.findById(reviewId);
    
      if (!review) {
      req.flash('error', 'Review not found');
      return res.redirect(`/listings/${id}`);
      }

    // CRITICAL FIX 2: Simplified and Corrected Authorization Check
    // The user must be logged in (checked by isLoggedIn middleware) AND be the author.
    const isAuthor = req.user && review.author && String(review.author) === String(req.user._id);

      if (!isAuthor) {
      req.flash('error', "You don't have permission to delete this review");
      return res.redirect(`/listings/${id}`);
      }
    
    // Atomically pull the review reference from the Listing document
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    
    // Delete the Review document itself
      await Review.findByIdAndDelete(reviewId);
    
      req.flash('success', 'Review deleted successfully');
      res.redirect(`/listings/${id}`);
}