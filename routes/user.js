const express = require("express");
const router = express.Router();
const passport = require("passport");

const WrapAsync = require("../utils/WrapAsync");
const { saveRedirectUrl } = require("../middelware");
const userController = require("../controllers/user");

// =====================
// Signup
// =====================
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(WrapAsync(userController.registerUser));

// =====================
// Login
// =====================
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.loginUser
    );

// =====================
// Logout
// =====================
router.get("/logout", userController.logoutUser);

module.exports = router;