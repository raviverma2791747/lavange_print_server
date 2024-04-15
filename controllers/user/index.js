const mongoose = require("mongoose");
const UserModel = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const RightType = require("../../models/right");
const RoleModel = require("../../models/role");
const { STATUS, USER_STATUS } = require("../../helper/constants");

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
      .populate({
        path: "role",
        select: "_id name",
      })
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

const getUse = async (req, res, next) => {
  try {
    let User = await UserModel.findById({ _id: req.params.id }).lean();

    // User.assets = User.assets.map((asset) => {
    //   return {
    //     ...asset,
    //     url: `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${asset.id}`,
    //   };
    // });

    return res.json({
      status: 200,
      data: {
        User,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
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
        User: {
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
  try {
    const user = await UserModel.findOne({ username: req.body.username });
    if (user) {
      return res.json({ status: 200 });
    }

    return res.json({ status: 400 });
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username, status: USER_STATUS.ACTIVE });

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

    const { id: userId, username: _username, firstName, lastName } = user;

    // await newActivity.save();

    const token = jwt.sign(
      { userId, username: _username, firstName, lastName },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "8h",
      }
    );

    res.json({
      status: 200,
      data: {
        token,
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

    const { id: userId, username: _username, firstName, lastName } = user;

    // await newActivity.save();

    const token = jwt.sign(
      {
        userId,
        username: _username,
        firstName,
        lastName,
        role: user.role.name,
        rights: user.role.rights,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "8h",
      }
    );

    res.json({
      status: 200,
      messages: ["Login Successful!"],
      data: {
        token,
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

const userLoginGoogle = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.json({ status: 400 });
    }

    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    let token_info;

    try {
      token_info = await oAuth2Client.verifyIdToken({ idToken: token });
    } catch (error) {
      return res.json({ status: 400 });
    }

    let user = await UserModel.findOne({
      $or: [
        { username: token_info.payload.email },
        { email: token_info.payload.email },
      ],
    });

    if (!user) {
      const userRole = await RoleModel.findOne({ name: "user" });
      user = new UserModel({
        username: token_info.payload.email,
        firstName: token_info.payload.given_name,
        lastName: token_info.payload.family_name,
        email: token_info.payload.email,
        role: userRole._id,
      });

      await user.save();
    }

    const { id: userId, username: _username, firstName, lastName } = user;

    // await newActivity.save();

    const jwt_token = jwt.sign(
      { userId, username: _username, firstName, lastName },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "8h",
      }
    );

    return res.json({
      status: 200,
      data: {
        token: jwt_token,
      },
    });
  } catch (error) {
    next(error);
  }
};

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

const userUpdatePassword = async (req, res, next) => {
  try {
    let user = await UserModel.findById(req.user.userId);
    const { currentPassword, newPassword } = req.body;

    if (user.password && !bcrypt.compareSync(currentPassword, user.password)) {
      return res.json({ status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return res.json({ status: 200 });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchUser,
  getUser,
  updateUser,
  getUserPublic,
  loginUserPublic: userLogin,
  userExistPublic: userExist,
  registerUserPublic: userRegister,
  loginUserGooglePublic: userLoginGoogle,
  userInfo,
  updatePassword: userUpdatePassword,
  userLoginAdmin,
};
