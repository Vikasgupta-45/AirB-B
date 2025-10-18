const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true, // ✅ fixed
  },
  description: {
    type: String,
  },
  image: {
    filename: {
      type: String,
      default: "listingimage", // optional default filename
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjN8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D",
    },
  },
  price: {
    type: Number,
    required: true, // ✅ fixed
    default: 0,     // optional to avoid null issues
  },
  location: {
    type: String,
    required: true, // ✅ fixed
  },
  country: {
    type: String,
    required: true, // ✅ fixed
  },
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review",
  }],
  owner:{
    type: Schema.Types.ObjectId,
    ref:"User",
  },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
