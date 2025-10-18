const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const {ListingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/Review.js");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy  = require("passport-local");
const User = require("./models/user.js");
const {isLoggedIn, saveRedirectUrl}=require("./middleware.js");


app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
const { listingSchemab } = require("./schema.js");
const { Console } = require("console");
app.use(methodOverride("_method"));


//session and flash
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expire:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error")
    res.locals.currentUser=req.user;
    next();
});

// database connection
main()
    .then(() => {
        console.log("Connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/AirBnB');
}

app.get("/", async(req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
});

const validateListing =(req,res,next)=>{
    let {error}= ListingSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400,msg);
    }
    else{
        next();
    }
}
const validateReview =(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400,msg);
    }
    else{
        next();
    }
}

// get all listing
app.get("/listings", wrapAsync(async (req, res, next) => {
    const allListing = await Listing.find({});
    
    res.render("listings/index", { allListing });
}));

// New route
app.get("/listings/new", isLoggedIn,(req, res) => {
    
    res.render("listings/new");
    
    
});

//signup
app.get("/signup",(req,res)=>{
    res.render("user/signup")
})

app.post("/signup",async(req,res)=>{
    try{  
        let {username,email,password}=req.body;
    const newUser = new User({email,username});
   const data=await User.register(newUser,password);
    //  req.login(registeredUser, err => {
        // if (err) return next(err);
        console.log(data);
        req.login(data, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Airbnb!");
            res.redirect("/listings");
        });
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");

    }
  
    // });
});
//login
app.get("/login",(req,res)=>{
    res.render("user/login");
})


app.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,}),async(req,res)=>{
    req.flash("success","Welcome back to AirBnB");
    res.redirect(res.locals.redirectUrl || "/listings");
});
app.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        else{
            req.flash("success","logged out successfully");
            res.redirect("/listings");
        }});
});

// show all listing
app.get("/listings/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing)
{
    req.flash("error","Listing was not there");
    return res.redirect("/listings");
}   
console.log(listing);
 res.render("listings/show", { listing });
}));

// add a new listings
app.post("/listings",isLoggedIn, validateListing,async (req, res, next) => {  
      // Check if the URL is an empty string and delete it if so
    if (req.body.listing.image.url === "") {
        delete req.body.listing.image.url;
    }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success","New listing created");
        res.redirect("/listings");
    
});

// edit route
app.get("/listings/:id/edit", isLoggedIn,wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

// Update listing
app.put("/listings/:id", isLoggedIn,validateListing,wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","listing edited successfully");
    res.redirect(`/listings/${id}`);
}));

// delete listing
app.delete("/listings/:id", isLoggedIn,wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully");
    res.redirect("/listings");
}));
//review adding
app.post("/listings/:id/reviews",validateReview,wrapAsync (async (req,res,next)=>{
    let listing=await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//deletereviewroute
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
  let{id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findById(reviewId)
  res.redirect(`/listings/${id}`);
}));

// Final error-handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
});


app.listen(8000, () => {
    console.log("Server is working on port 8000");
});