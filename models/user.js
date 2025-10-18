const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose= require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true // Added unique constraint for better practice
    }
});

// 🌟 CRITICAL FIX: Apply the plugin to the schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);