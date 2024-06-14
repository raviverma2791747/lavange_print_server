const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../../../models/user");
const RoleModel = require("../../../models/role");
const sendEmailVerificationOTP = require("../../../helper/sendEmailVerification");
const { USER_STATUS } = require("../../../helper/constants");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      // passReqToCallback: true,
      scope: ["profile", "email"],
      store: true,
    },
    async function (accessToken, refreshToken, profile, done) {
      const profileInfo = profile._json;

      let user = await UserModel.findOne({
        $or: [{ username: profileInfo.email }, { email: profileInfo.email }],
      }).populate("role");

      if (!user) {
        const userRole = await RoleModel.findOne({ name: "user" });
        user = new UserModel({
          username: profileInfo.email,
          firstName: profileInfo.given_name,
          lastName: profileInfo.family_name ?? "",
          email: profileInfo.email,
          role: userRole._id,
          status: USER_STATUS.ACTIVE,
        });

        await user.save();

        //await sendEmailVerificationOTP(user);
      }
      return done(null, user.toObject());
    }
  )
);
