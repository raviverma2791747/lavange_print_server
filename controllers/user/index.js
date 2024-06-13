const mongoose = require("mongoose");
const UserModel = require("../../models/user");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const RightType = require("../../models/right");
const RoleModel = require("../../models/role");
const TokenModel = require("../../models/token");
const OtpModel = require("../../models/otp");
const { STATUS, USER_STATUS } = require("../../helper/constants");
const passport = require("passport");
require("./auth/google");
const sendEmailVerificationOTP = require("../../helper/sendEmailVerification");
const generateTokens = require("../../helper/generateTokens");
const setTokenCookies = require("../../helper/setTokenCookies");
const refreshAccessToken = require("../../helper/refreshAccessToken");
const transporter = require("../../config/emailConfig");
const jwt = require("jsonwebtoken");

const fetchUser = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    // if (search) {
    //   filter["name"] = {
    //     $regex: search,
    //     $options: "i",
    //   };
    // }

    let users = await UserModel.find()
      .skip(page * limit)
      .limit(limit)
      .lean();

    //   Users.forEach((User) => {
    //     User.assets = User.assets.map((asset) => {
    //       return {
    //         ...asset,
    //         url: `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${asset.id}`,
    //       };
    //     });
    //   });

    const total = await UserModel.countDocuments({
      title: {
        $regex: search,
        $options: "i",
      },
    });

    return res.json({
      status: 200,
      data: {
        users,
        total: total,
        page: page + 1,
        limit: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    let user = await UserModel.findById({ _id: req.params.id })
      // .populate({
      //   path: "role",
      //   select: "_id name",
      // })
      .lean();

    // User.assets = User.assets.map((asset) => {
    //   return {
    //     ...asset,
    //     url: `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${asset.id}`,
    //   };
    // });

    return res.json({
      status: 200,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    console.log(req.body._id);
    const _id = req.body._id ?? new mongoose.Types.ObjectId();

    const User = await UserModel.updateOne(
      {
        _id,
      },
      req.body,
      {
        upsert: true,
        new: true,
      }
    );
    return res.json({
      status: 200,
      data: {
        user: {
          _id,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

//Public
const getUserPublic = async (req, res, next) => {
  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);
    // let User = await UserModel.findById({ _id: req.params.id })
    //   .select("-password")
    //   .lean();

    // User.assets = User.assets.map((asset) => {
    //   return {
    //     ...asset,
    //     url: `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${asset.id}`,
    //   };
    // });

    // const variantConfig = User.variantConfigs.find((variantConfig) => {
    //   return variantConfig.status === STATUS.ACTIVE;
    // });

    // if (variantConfig !== undefined) {
    //   User.variants = variantConfig.variants;
    //   User.variantOptions = variantConfig.variantSchema;
    //   User.schemaId = variantConfig._id;
    // }

    // delete User.variantConfigs;

    return res.json({
      status: 200,
      data: {
        user: user[0],
      },
    });
  } catch (error) {
    next(error);
  }
};

const userExist = async (req, res, next) => {
  const user = await UserModel.findOne({ username: req.body.username });
  if (user) {
    return res.json({ status: 200 });
  }
  return res.json({ status: 400 });
};

const userLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({
      username,
      status: USER_STATUS.ACTIVE,
    });

    // if (!user.account) {
    //   const newAccount = await AccountModel.create({
    //     balance: 0, // Set an initial balance as needed
    //   });
    //   user.account = newAccount._id;
    //   await user.save();
    // }

    // if (!user.role) {
    //   const userRole = await RoleModel.findOne({ name: "user" });
    //   user.role = userRole._id;
    //   await user.save();
    // }

    if (!user) {
      return res.json({ status: 400 });
    }

    // const newActivity = new ActivityModel({
    //   description: ActivityDescriptions.USER_LOGIN,
    //   affected: {
    //     users: [],
    //   },
    //   user: user.id,
    //   activityType: ActivityTypes.USER,
    // });

    // await newActivity.save();

    if (!bcrypt.compareSync(password, user.password)) {
      return res.json({ status: 400 });
    }

    // await user.populate({
    //   path: "role",
    //   select: ["_id", "name", "rights"], // Specify the fields you want to populate
    // });

    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      await generateTokens(user);

    setTokenCookies(
      res,
      accessToken,
      refreshToken,
      accessTokenExp,
      refreshTokenExp
    );

    res.json({
      status: 200,
      data: {
        accessToken,
        refreshToken,
        access_token_exp: accessTokenExp,
        refresh_token_exp: refreshTokenExp,
      },
    });
  } catch (error) {
    next(error);
  }
};

const userLoginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username }).populate("role");

    // if (!user.account) {
    //   const newAccount = await AccountModel.create({
    //     balance: 0, // Set an initial balance as needed
    //   });
    //   user.account = newAccount._id;
    //   await user.save();
    // }

    // if (!user.role) {
    //   const userRole = await RoleModel.findOne({ name: "user" });
    //   user.role = userRole._id;
    //   await user.save();
    // }

    if (!user) {
      return res.json({ status: 400, messages: ["Invalid credentials!"] });
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      return res.json({ status: 400, messages: ["Invalid credentials!"] });
    }

    if (user.role.rights.includes(RightType.ADMIN_ACCESS) === false) {
      return res.json({ status: 400, messages: ["Invalid credentials!"] });
    }

    // const newActivity = new ActivityModel({
    //   description: ActivityDescriptions.USER_LOGIN,
    //   affected: {
    //     users: [],
    //   },
    //   user: user.id,
    //   activityType: ActivityTypes.USER,
    // });

    // await newActivity.save();

    if (!bcrypt.compareSync(password, user.password)) {
      return res.json({ status: 400, messages: ["Invalid credentials!"] });
    }

    // await user.populate({
    //   path: "role",
    //   select: ["_id", "name", "rights"], // Specify the fields you want to populate
    // });

    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      await generateTokens(user);

    setTokenCookies(
      res,
      accessToken,
      refreshToken,
      accessTokenExp,
      refreshTokenExp
    );

    res.json({
      status: 200,
      messages: ["Login Successful!"],
      data: {
        accessToken,
        refreshToken,
        access_token_exp: accessTokenExp,
        refresh_token_exp: refreshTokenExp,
      },
    });
  } catch (error) {
    next(error);
  }
};

const userRegister = async (req, res, next) => {
  try {
    const { username, password, firstName, lastName, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = await RoleModel.findOne({ name: "user" });

    const user = new UserModel({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: userRole._id,
    });
    await user.save();
    res.json({ status: 200, data: { msg: "User registered successfully" } });
  } catch (error) {
    next(error);
  }
};

//legacy
// const userLoginGoogle = async (req, res, next) => {
//   try {
//     const { token } = req.body;

//     if (!token) {
//       return res.json({ status: 400 });
//     }

//     const oAuth2Client = new OAuth2Client(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );

//     let token_info;

//     try {
//       token_info = await oAuth2Client.verifyIdToken({ idToken: token });
//     } catch (error) {
//       return res.json({ status: 400 });
//     }

//     let user = await UserModel.findOne({
//       $or: [
//         { username: token_info.payload.email },
//         { email: token_info.payload.email },
//       ],
//     });

//     if (!user) {
//       const userRole = await RoleModel.findOne({ name: "user" });
//       user = new UserModel({
//         username: token_info.payload.email,
//         firstName: token_info.payload.given_name,
//         lastName: token_info.payload.family_name,
//         email: token_info.payload.email,
//         role: userRole._id,
//       });

//       await user.save();
//     }

//     const { id: userId, username: _username, firstName, lastName } = user;

//     // await newActivity.save();

//     const jwt_token = jwt.sign(
//       { userId, username: _username, firstName, lastName },
//       process.env.JWT_SECRET_KEY,
//       {
//         expiresIn: "8h",
//       }
//     );

//     return res.json({
//       status: 200,
//       data: {
//         token: jwt_token,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const userInfo = async (req, res, next) => {
  try {
    // let user = await UserModel.findById(req.user.userId)
    //   .select("-password")
    //   .lean();

    // user.addresses = user.addresses.filter(
    //   (address) => address.status !== "archive"
    // );

    const user = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $set: {
          addresses: {
            $filter: {
              input: "$addresses",
              as: "address",
              cond: {
                $eq: ["$$address.status", STATUS.ACTIVE],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "role",
        },
      },
      {
        $set: {
          role: {
            $first: "$role",
          },
        },
      },
      // {
      //   $lookup: {
      //     from: "product",
      //     localField: "product",
      //     foreignField: "_id",
      //     as: "product",
      //   },
      // },
      {
        $project: {
          password: 0,
          // role: {
          //   rights: 0,
          // }
        },
      },
    ]);
    return res.json({ status: 200, data: { user: user[0] } });
  } catch (error) {
    next(error);
  }
};

const userUpdatePassword = async (req, res) => {
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res.json({
      status: 400,
      messages: ["Password and confirm Password is required"],
    });
  }

  if (password !== confirmPassword) {
    return res.json({
      status: 400,
      messages: ["Password and confirm Password does not match"],
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await UserModel.findByIdAndUpdate(req.user.userId, {
    password: hashedPassword,
  });

  return res.json({ status: 200, messages: ["Password updated successfully"] });
};

const userSendPasswordResetEmail = async (req, res) => {
  const { email, url } = req.body;

  if (!email) {
    return res.json({ status: 400, messages: ["Email is required"] });
  }

  const user = await UserModel.findOne({
    $or: [{ email }, { username: email }],
  });

  if (!user) {
    return res.json({ status: 400, messages: ["User not found!"] });
  }

  const secret = user._id + process.env.JWT_ACCESS_SECRET_KEY;
  const token = jwt.sign({ userId: user._id }, secret, {
    expiresIn: "15m",
  });

  const link = `${url}/${user._id}/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Password Reset Link",
    html: `<p>Hello ${user.username}</p>
    <p>Use the following link to reset your password: </p>
    <a href="${link}">${link}</a>
    <p>Note that this link will expire in 15 minutes.</p>
    `,
  });

  return res.json({ status: 200, messages: ["Password reset link sent"] });
};

const userPasswordReset = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { id, token } = req.params;

  const user = await UserModel.findById(id);

  if (!user) {
    return res.json({ status: 400, messages: ["User not found"] });
  }

  const new_secret = user._id + process.env.JWT_ACCESS_SECRET_KEY;
  try {
    jwt.verify(token, new_secret);
  } catch (error) {
    return res.json({ status: 400, messages: ["Invalid token"] });
  }
  if (!password || !confirmPassword) {
    return res.json({ status: 400, messages: ["Password is required"] });
  }

  if (password !== confirmPassword) {
    return res.json({ status: 400, messages: ["Password does not match"] });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();
  return res.json({ status: 200, messages: ["Password updated successfully"] });
};

const userVerifyEmail = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.json({ status: 400 });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.json({ status: 400, messages: ["User not found"] });
  }

  if (user.isVerified) {
    return res.json({
      status: 200,
      data: {},
      messages: ["Email already verified"],
    });
  }

  const otp_data = await OtpModel.findOne({ user: user._id, otp });

  if (!otp_data) {
    await sendEmailVerificationOTP(user);
    return res.json({ status: 400, messages: ["OTP Expired. New OTP sent"] });
  }

  user.isVerified = true;
  await user.save();
  await OtpModel.deleteOne({ _id: otp_data._id });
  return res.json({
    status: 200,
    data: {},
    messages: ["Email verified successfully"],
  });
};

const userLoginGoogle = async (req, res, next) => {
  const { _id: userId, username: _username, firstName, lastName } = req.user;
  const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
    await generateTokens(userId, _username, firstName, lastName, res);
  setTokenCookies(
    res,
    accessToken,
    refreshToken,
    accessTokenExp,
    refreshTokenExp
  );
  return res.redirect(req.authInfo.state.redirect_uri);
};

// const getAccessToken = async (req, res, next) => {
//   const {
//     newAccessToken,
//     newRefreshToken,
//     newAccessTokenExp,
//     newRefreshTokenExp,
//   } = await refreshAccessToken(req, res);

//   setTokenCookies(
//     res,
//     newAccessToken,
//     newRefreshToken,
//     newAccessTokenExp,
//     newRefreshTokenExp
//   );

//   return res.json({
//     status: 200,
//     data: {
//       accessToken: newAccessToken,
//       refreshToken: newRefreshToken,
//       accessTokenExp: newAccessTokenExp,
//       refreshTokenExp: newRefreshTokenExp,
//     },
//     messages: ["Token refreshed successfully"],
//   });
// };

const userLogout = async (req, res, next) => {
  const refreshAccessToken = req.cookies.refreshToken;

  if (refreshAccessToken) {
    const userRefreshToken = await TokenModel.findOneAndUpdate(
      { token: refreshAccessToken },
      { $set: { blacklisted: true } }
    );
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.json({ status: 200, messages: ["Logout successful!"] });
};

module.exports = {
  fetchUser,
  getUser,
  updateUser,
  getUserPublic,
  loginUserPublic: userLogin,
  userExistPublic: userExist,
  registerUserPublic: userRegister,
  //loginUserGooglePublic: userLoginGoogle,
  userLoginGoogle,
  userInfo,
  updatePassword: userUpdatePassword,
  userLoginAdmin,
  userVerifyEmail,
  // getAccessToken,
  userLogout,
  userSendPasswordResetEmail,
  userPasswordReset,
};
