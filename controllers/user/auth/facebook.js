const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const UserModel = require("../../../models/user");
const RoleModel = require("../../../models/role");
const sendEmailVerificationOTP = require("../../../helper/sendEmailVerification");
const { USER_STATUS } = require("../../../helper/constants");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      store: true,
      profileFields: ["id", "displayName", "name", "email"],
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
          firstName: profileInfo.first_name,
          lastName: profileInfo.last_name ?? "",
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
