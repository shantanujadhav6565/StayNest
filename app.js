require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

const app = express();


// ======================================================
// PORT
// ======================================================

const port = process.env.PORT || 8080;


// ======================================================
// DATABASE
// ======================================================

async function main() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("=================================");
        console.log("Database Connected");
        console.log(
            "Database Name:",
            mongoose.connection.db.databaseName
        );
        console.log("=================================");

    } catch (err) {

        console.error("=================================");
        console.error("DATABASE CONNECTION ERROR:");
        console.error(err);
        console.error("=================================");

    }

}

main();


// ======================================================
// EJS
// ======================================================

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);

app.engine(
    "ejs",
    ejsMate
);


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    methodOverride("_method")
);

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ======================================================
// SESSION
// ======================================================

const sessionOption = {

    secret:
        process.env.SESSION_SECRET ||
        "fallbacksecret",

    resave: false,

    saveUninitialized: false,

    store: MongoStore.create({

        mongoUrl:
            process.env.MONGO_URI,

        collectionName:
            "sessions",

        ttl:
            7 * 24 * 60 * 60

    }),

    cookie: {

        expires:
            new Date(
                Date.now() +
                7 * 24 * 60 * 60 * 1000
            ),

        maxAge:
            7 * 24 * 60 * 60 * 1000,

        httpOnly: true,

        secure: false

    }

};

app.use(
    session(sessionOption)
);


// ======================================================
// FLASH
// ======================================================

app.use(flash());


// ======================================================
// PASSPORT
// ======================================================

app.use(
    passport.initialize()
);

app.use(
    passport.session()
);

passport.use(
    new LocalStrategy(
        User.authenticate()
    )
);

passport.serializeUser(
    User.serializeUser()
);

passport.deserializeUser(
    User.deserializeUser()
);


// ======================================================
// GLOBAL VARIABLES
// ======================================================

app.use(
    (req, res, next) => {

        res.locals.success =
            req.flash("success");

        res.locals.error =
            req.flash("error");

        res.locals.currUser =
            req.user;

        res.locals.mapToken =
            process.env.MAP_TOKEN;

        next();

    }
);


// ======================================================
// HOME ROUTE
// ======================================================

app.get(
    "/",
    (req, res) => {

        res.redirect(
            "/listings"
        );

    }
);


// ======================================================
// ROUTES
// ======================================================

// Listings

app.use(
    "/listings",
    listingRouter
);


// Reviews

app.use(
    "/listings/:id/reviews",
    reviewRouter
);


// Users

app.use(
    "/",
    userRouter
);


// ======================================================
// 404 ERROR
// ======================================================

app.all(
    "*",
    (req, res, next) => {

        next(
            new ExpressError(
                404,
                "Page Not Found"
            )
        );

    }
);


// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use(
    (err, req, res, next) => {

        console.error("");
        console.error(
            "========================================"
        );

        console.error(
            "GLOBAL ERROR"
        );

        console.error(
            "========================================"
        );

        console.error(
            "URL:",
            req.originalUrl
        );

        console.error(
            "METHOD:",
            req.method
        );

        console.error(
            "STATUS:",
            err.statusCode || 500
        );

        console.error(
            "MESSAGE:",
            err.message
        );

        console.error(
            "FULL ERROR:"
        );

        console.error(err);

        console.error(
            "========================================"
        );

        console.error("");


        const statusCode =
            err.statusCode || 500;

        const message =
            err.message ||
            "Something Went Wrong!";


        // ================= RENDER ERROR PAGE =================

        res.status(statusCode).render(
            "error.ejs",
            {
                message
            }
        );

    }
);


// ======================================================
// SERVER
// ======================================================

app.listen(
    port,
    () => {

        console.log(
            `Server Started on Port ${port}`
        );

    }
);