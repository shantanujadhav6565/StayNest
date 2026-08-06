const User = require("../models/user");

// ================= Render Signup Form =================
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// ================= Register User =================
module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({
            username,
            email,
        });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to StayNest!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

// ================= Render Login Form =================
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// ================= Login User =================
module.exports.loginUser = (req, res) => {
    req.flash("success", "Welcome Back to StayNest!");

    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// ================= Logout User =================
module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};