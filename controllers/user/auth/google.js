const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../../../models/user");
const RoleModel = require("../../../models/role");
const sendEmailVerificationOTP = require("../../../helper/sendEmailVerification");
const { USER_STATUS } = require("../../../helper/constants");
const { sendEmail } = require("../../../helper/utils");
const { welcomeEmail } = require("../../../helper/email/welcome");

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

        try {
          await sendEmail({
            email: user.email,
            subject: `Welcome to ${process.env.BRAND_NAME} - Your One-Stop Solution for On-Demand Printing!`,
            html: welcomeEmail({
              name: user.firstName,
              companyName: `${process.env.COMPANY_NAME}`,
              companyAddress: `${process.env.COMPANY_ADDRESS}`,
              brandName: process.env.BRAND_NAME,
              website: `${process.env.CLIENT_URL}`,
              linkedin: `${process.env.SOCIAL_TWITTER}`,
              twitter: `${process.env.SOCIAL_LINKEDIN}`,
            }),
          });
        } catch (error) {}
      }
      return done(null, user.toObject());
    }
  )
);
