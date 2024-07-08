const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("../../../controllers/user/auth/google");
require("../../../controllers/user/auth/jwt-auth");
require("../../../controllers/user/auth/facebook");
const {
  loginUserPublic,
  userExistPublic,
  registerUserPublic,
  userLoginAdmin,
  userVerifyEmail,
  userLoginGoogle,
  userLoginFacebook,
  userLogout,
  userSendPasswordResetEmail,
  userPasswordReset,
} = require("../../../controllers/user");

const router = express.Router();

router.post("/login", asyncHandler(loginUserPublic));
router.post("/login/admin", asyncHandler(userLoginAdmin));
router.post("/register", asyncHandler(registerUserPublic));
router.post("/exist", asyncHandler(userExistPublic));
router.get("/auth/google", (req, res, next) => {
  const redirect_uri = req.query.redirect_uri;
  passport.authenticate("google", {
    // scope: ["email", "profile"],
    state: {
      redirect_uri: redirect_uri,
    },
  })(req, res, next);
});
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.GOOGLE_CALLBACK_URL,
  }),
  asyncHandler(userLoginGoogle)
);
router.get("/auth/facebook", (req, res, next) => {
  const redirect_uri = req.query.redirect_uri;
  passport.authenticate("facebook", {
    scope: ["email"],
    state: {
      redirect_uri: redirect_uri,
    },
  })(req, res, next);
});
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: process.env.FACEBOOK_CALLBACK_URL,
  }),
  asyncHandler(userLoginFacebook)
);
router.post("/verify/email", asyncHandler(userVerifyEmail));
router.post("/logout", asyncHandler(userLogout));
router.post("/password/reset/:id/:token", asyncHandler(userPasswordReset));
router.post(
  "/password/reset/link",
  asyncHandler(userSendPasswordResetEmail)
);

module.exports = router;
