if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { saveRedirectUrl } = require("./middleware.js");
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const methodOverride = require("method-override");
const { listingSchemab } = require("./schema.js");
const { Console } = require("console");
const { cloudinary } = require("./cloudConfig.js");


// --- Configuration Setup ---
const dbUrl = process.env.ATLASDB_URL || 'mongodb://127.0.0.1:27017/AirBnB';
const sessionSecret = process.env.SECRET || 'dev_session_secret_32_chars_long_please';


// --- Mongoose Connection Function ---
async function main() {
    await mongoose.connect(dbUrl);
}

// --- Connect to DB and Start Server ---
main()
    .then(() => {
        console.log("Connected to db");
        
        // **********************************************
        // 1. SESSION STORE SETUP (MOVED INSIDE .then())
        // **********************************************
        const store = MongoStore.create({
    mongoUrl: dbUrl,
    collectionName: "sessions",
    ttl: 14 * 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
    store,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


        // --- Middleware Application ---
        
        // Static file, EJS, and URL parsing
        app.set("view engine", "ejs");
        app.engine("ejs", ejsMate);
        app.set("views", path.join(__dirname, "views"));
        app.use(express.static(path.join(__dirname, "/public")));
        app.use(express.urlencoded({ extended: true }));
        app.use(methodOverride("_method"));

        // Session and Flash MUST be applied before Passport and routes
        app.use(session(sessionOptions));
        app.use(flash());

        // Passport Authentication
        app.use(passport.initialize());
        app.use(passport.session());
        passport.use(new LocalStrategy(User.authenticate()));
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());

        // Response locals/flash middleware
        app.use((req, res, next) => {
            res.locals.success = req.flash("success");
            res.locals.error = req.flash("error");
            res.locals.currentUser = req.user;
            res.locals.q = req.query && req.query.q ? req.query.q : '';
            next();
        });

        // --- Routes ---
        app.use("/listings", listingRoutes);
        app.use("/listings/:id/reviews", reviewRoutes);
        app.use("/", userRoutes);

        // Home Route
        app.get("/", async (req, res) => {
            const allListing = await Listing.find({});
            res.render("listings/index", { allListing });
        });

        // --- Final Error-Handling Middleware ---
        app.use((err, req, res, next) => {
            if (res.headersSent) {
                return next(err);
            }
            const statusCode = err && err.statusCode ? err.statusCode : 500;
            const message = err && err.message ? err.message : "Something went wrong";
            console.error("[error]", statusCode, message);
            res.status(statusCode).render("error.ejs", { err });
        });

        // **********************************************
        // 2. START SERVER (MOVED INSIDE .then())
        // **********************************************
        app.listen(8000, () => {
            console.log("Server is working on port 8000");
        });

    })
    .catch((err) => {
        // Log a fatal error and optionally exit if the database is essential
        console.error("FATAL ERROR: Could not connect to database.", err);
        // process.exit(1); 
    });