const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const axios = require("axios");

const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

console.log("MAP_TOKEN =", process.env.MAP_TOKEN ? "Loaded" : "Missing");

main()
    .then(async () => {
        console.log("Database Connection Successful!!");

        console.log(
            "Mongo Host:",
            mongoose.connection.host
        );

        console.log(
            "Database Name:",
            mongoose.connection.db.databaseName
        );

        const userCount = await User.countDocuments();

        console.log(
            "Users Found:",
            userCount
        );

        await initDB();
    })
    .catch((err) => {
        console.log("Error:", err);
    });


async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Database Connected");
    } catch (err) {
        console.log(
            "Database Connection Error:",
            err
        );

        throw err;
    }
}


const initDB = async () => {
    try {
        // Delete existing listings
        await Listing.deleteMany({});

        const listings = [];

        for (let obj of initData.data) {

            let geometry = {
                type: "Point",
                coordinates: [],
            };

            try {

                const response = await axios.get(
                    `https://api.maptiler.com/geocoding/${encodeURIComponent(
                        obj.location
                    )}.json?key=${process.env.MAP_TOKEN}`
                );

                if (
                    response.data.features &&
                    response.data.features.length > 0
                ) {

                    geometry = {
                        type: "Point",
                        coordinates:
                            response.data.features[0]
                                .geometry.coordinates,
                    };

                } else {

                    console.log(
                        `Location not found: ${obj.location}`
                    );

                }

            } catch (err) {

                console.log(
                    `Error while fetching location: ${obj.location}`
                );

            }

            listings.push({
                ...obj,

                // Existing user ID as listing owner
                owner: "6a782290c3170d931f91fbe0",

                geometry: geometry,
            });
        }

        await Listing.insertMany(listings);

        console.log(
            "Data was initialized successfully!"
        );

        await mongoose.connection.close();

        console.log(
            "Database connection closed."
        );

    } catch (err) {

        console.log(
            "Database initialization error:",
            err
        );

        await mongoose.connection.close();
    }
};