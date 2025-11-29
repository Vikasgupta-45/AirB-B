require("dotenv").config({ path: "../.env" });  // <-- FIXED
console.log("Loaded DB URL =", process.env.ATLASDB_URL);

const mongoose = require("mongoose");
const { data } = require("./data.js");
const Listing = require("../models/listing.js");

const ownerId = new mongoose.Types.ObjectId("6929ba35009ceedaa7eae92a");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    try {
        await mongoose.connect(dbUrl);
        console.log("✅ Connected to Atlas DB");
    } catch (err) {
        console.log("❌ Database connection failed:", err);
        process.exit(1);
    }
}

async function initDB() {
    try {
        console.log("🧹 Deleting old listings...");
        await Listing.deleteMany({});

        console.log("📌 Inserting new listings...");
        const updatedData = data.map(obj => ({
            ...obj,
            owner: ownerId
        }));

        await Listing.insertMany(updatedData);
        console.log("🎉 Listings successfully inserted into Atlas!");
    } catch (err) {
        console.log("❌ Error while inserting data:", err);
    } finally {
        mongoose.connection.close();
        console.log("🔒 Database connection closed");
    }
}

main().then(initDB);
