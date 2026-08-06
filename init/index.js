const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const axios = require("axios");

const initData = require("./data.js");
const Listing = require("../models/listing.js");

console.log("MAP_TOKEN =", process.env.MAP_TOKEN);

main()
    .then(() => {
        console.log("Database Connection Successful!!");
        return initDB();
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/StayNest");
}

const initDB = async () => {
    try {
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

                if (response.data.features.length > 0) {
                    geometry = {
                        type: "Point",
                        coordinates:
                            response.data.features[0].geometry.coordinates,
                    };
                } else {
                    console.log(`Location not found: ${obj.location}`);
                }
            } catch (err) {
                console.log(`Error while fetching location: ${obj.location}`);
            }

            listings.push({
                ...obj,
                owner: "6a704964d34ab0744ff48d3a", // Replace with your User _id
                geometry: geometry,
            });
        }

        await Listing.insertMany(listings);

        console.log("Data was initialized successfully!");

        mongoose.connection.close();
    } catch (err) {
        console.log(err);
    }
};