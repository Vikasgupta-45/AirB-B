const express = require("express");
const router = express.Router(); // Using express.Router() is correct
const passport = require("passport");   
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/User.js"); // All logic moved here
const wrapAsync = require("../utils/wrapAsync.js"); // ADDED: Required for async routes


// ------------------------------------
// SIGNUP ROUTES
// ------------------------------------
router.get("/signup", userController.signupform);

// ADDED wrapAsync: signup often involves async database/hashing operations (User.register)
router.post("/signup", wrapAsync(userController.signup));


// ------------------------------------
// LOGIN ROUTES
// ------------------------------------
router.get("/login", userController.loginform);

router.post(
    "/login", 
    saveRedirectUrl, 
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }), 
    // ADDED wrapAsync: login controller logic often handles async redirection logic
    wrapAsync(userController.login) 
);


// ------------------------------------
// LOGOUT ROUTE
// ------------------------------------
// Logout should not be wrapped with wrapAsync since it uses a callback-based API
router.get("/logout", userController.logout);

module.exports = router;
