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
const hcaptcha = require("hcaptcha");

const fetchUser = async (req, res) => {
  const filter = {};
  const status = req.query.status;
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 10;

  filter["username"] = {
    $regex: req.query.search ?? "",
    $options: "i",
  };

  if (status) {
    filter["status"] = status;
  }

  let sort = {};

  if (req.query.sort) {
    sort[req.query.sort] = req.query.order === "desc" ? -1 : 1;
  }

  const users = await UserModel.find()
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean({ virtuals: true });

  const total = await UserModel.find(filter).countDocuments();

  return res.json({
    status: 200,
    data: {
      users,
      total: total,
      limit: limit,
      page: page,
    },
  });
};

const getUser = async (req, res) => {
  const userId = req.user.userId;
  const user = await UserModel.findById(userId).lean({ virtuals: true });
  return res.json({
    status: 200,
    data: {
      user,
    },
  });
};

const updateUser = async (req, res) => {
  const userId = req.body._id ?? new mongoose.Types.ObjectId();
  const data = req.body;
  const user = await UserModel.updateOne(
    {
      _id: userId,
    },
    data,
    {
      upsert: true,
      new: true,
    }
  );
  return res.json({
    status: 200,
    data: {
      user: {
        id: userId,
      },
    },
  });
};

//Public
const getUserPublic = async (req, res) => {
  const userId = req.params.id;
  const user = await UserModel.findById(userId)
    .select("-password")
    .lean({ virtuals: true });
  return res.json({
    status: 200,
    data: {
      user,
    },
  });
};

const userExist = async (req, res) => {
  const username = req.body.username;
  const user = await UserModel.findOne({ username: username });
  if (user) {
    return res.json({ status: 200 });
  }
  return res.json({ status: 400 });
};

const userLogin = async (req, res) => {
  const { username, password, captcha_response } = req.body;
  const user = await UserModel.findOne({
    username,
    status: USER_STATUS.ACTIVE,
  }).populate("role");

  if (!user) {
    return res.json({ status: 400 });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.json({ status: 400, messages: ["Invalid credentials"] });
  }

  if (captcha_response) {
    const captcha_verification = await hcaptcha.verify(
      process.env.HCAPTCHA_SECRET_KEY,
      captcha_response
    );

    if (!captcha_verification.success) {
      return res.json({
        status: 401,
        messages: ["Captcha verification failed"],
      });
    }
  }

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
};

const userLoginAdmin = async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({
    username,
    status: USER_STATUS.ACTIVE,
  }).populate("role");

  if (!user) {
    return res.json({ status: 400, messages: ["Invalid credentials!"] });
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    return res.json({ status: 400, messages: ["Invalid credentials!"] });
  }

  if (user.role.rights.includes(RightType.ADMIN_ACCESS) === false) {
    return res.json({ status: 400, messages: ["Invalid credentials!"] });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.json({ status: 400, messages: ["Invalid credentials!"] });
  }

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
};

const userRegister = async (req, res) => {
  const { username, password, firstName, lastName, email, captcha_response } =
    req.body;

  if (captcha_response) {
    const captcha_verification = await hcaptcha.verify(
      process.env.HCAPTCHA_SECRET_KEY,
      captcha_response
    );

    if (!captcha_verification.success) {
      return res.json({
        status: 401,
        messages: ["Captcha verification failed"],
      });
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = await RoleModel.findOne({ name: "user" });

  const user = new UserModel({
    username,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: userRole._id,
    status: USER_STATUS.ACTIVE,
  });
  await user.save();
  res.json({ status: 200, data: { msg: "User registered successfully" } });
};
const userInfo = async (req, res) => {
  const userId = req.user.userId;
  const user = await UserModel.findById(userId)
    .select("-password")
    .populate("role")
    .populate("addresses")
    .lean({ virtuals: true });
  return res.json({ status: 200, data: { user } });
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
  const user = req.user;
  const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
    await generateTokens(user);
  setTokenCookies(
    res,
    accessToken,
    refreshToken,
    accessTokenExp,
    refreshTokenExp
  );
  return res.redirect(req.authInfo.state.redirect_uri);
};

const userLoginFacebook = async (req, res, next) => {
  const user = req.user;
  const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
    await generateTokens(user);
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
  userLoginGoogle,
  userLoginFacebook,
  userInfo,
  updatePassword: userUpdatePassword,
  userLoginAdmin,
  userVerifyEmail,
  userLogout,
  userSendPasswordResetEmail,
  userPasswordReset,
};
