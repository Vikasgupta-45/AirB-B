const mongoose = require("mongoose");
const {data} = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(()=>{
    console.log("Conneccted to db");
    
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/AirBnB')
}

const initDB = async ()=>{
      await Listing.deleteMany({});
     const ownerId = new mongoose.Types.ObjectId("64a7f3f4f2d3c9b1f0e4c8a1");
    const updatedData = data.map((obj) => ({
      ...obj,
      owner: ownerId,   })); // ✅ Use ObjectId, not string
      await Listing.insertMany(updatedData);
      console.log("data was initialize");
}
initDB();