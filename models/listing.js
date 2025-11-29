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
      default: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=400", // simplified default URL
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
    required:true,
  },
  geometry:{
    type:{
        type:String,
        enum:['Point'],
        // required:true,
    },  
    coordinates:{
        type:[Number],
        // required:true,
    }
  },
  category: {
    type: String,
    enum: ['Mountain','Trending','Beach','Island','Countryside','City','Camping','Snow','Desert','Lake','Villa'],
    default: 'Trending',
  }
});

// Pre-save middleware to ensure image and geometry exist with defaults
listingSchema.pre('save', function(next) {
  // Handle image defaults
  if (!this.image) {
    this.image = {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=400"
    };
  } else if (!this.image.url) {
    this.image.url = "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=400";
  }
  if (!this.image.filename) {
    this.image.filename = "listingimage";
  }
  
  // Handle geometry defaults (CRITICAL: must be complete Point object)
  if (!this.geometry || !this.geometry.type || !this.geometry.coordinates) {
    this.geometry = {
      type: "Point",
      coordinates: [72.8777, 19.0760] // Mumbai [lng, lat]
    };
  }
  
  next();
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
