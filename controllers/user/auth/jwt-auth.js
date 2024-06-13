const JWTStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const UserModel = require("../../../models/user");
const passport = require("passport");

var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_SECRET_KEY,
};
passport.use(
  new JWTStrategy(opts, async (payload, done) => {
    try {
      const user = await UserModel.findOne({ _id: payload.userId }).select(
        "-password -__v"
      );
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);
