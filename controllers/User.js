const User = require("../models/user.js");   

module.exports.signupform = (req,res)=>{
    res.render("user/signup")
};

module.exports.signup = async(req,res, next)=>{ // Added 'next' for completeness with wrapAsync
    try{  
        let {username,email,password}=req.body;
        const newUser = new User({email,username});
        const registeredUser=await User.register(newUser,password);
        
        req.login(registeredUser, err => {
            if (err) return next(err); // Pass error to Express handler
            
            req.flash("success", "Welcome to Airbnb!");
            res.redirect("/listings");
        });
    }
    catch(e){
        // Specific handling for user-facing errors (e.g., duplicate username)
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginform = (req,res)=>{
    res.render("user/login");
};

// FIX 1: Corrected export name to module.exports.login
module.exports.login = async(req,res, next)=>{ // FIX 3: Added 'next' to the signature
    req.flash("success","Welcome back to AirBnB");
    // The user is authenticated by the Passport middleware before this runs
    res.redirect(res.locals.redirectUrl || "/listings");
};

// FIX 2: Added 'next' to the signature
module.exports.logout = (req,res, next)=>{ 
    req.logout((err)=>{
        if(err){
            return next(err); // CRITICAL: Passes the error from req.logout to Express
        }
        else{
            req.flash("success","logged out successfully");
            res.redirect("/listings");
        }
    });
};