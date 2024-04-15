const mongoose = require("mongoose");
const { HomeConfigModel, PolicyConfigModel } = require("../models/config");
const { STATUS } = require("./constants");
const RoleModel = require("../models/role");
const RightType = require("../models/right");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");

const initUserRole = async () => {
  try {
    const existingUserRole = await RoleModel.findOne({ name: "user" });
    if (!existingUserRole) {
      ownerRole = await RoleModel.create({
        name: "user",
        rights: [],
      });
      console.log("User role created successfully");
      return;
    }
    console.log("User role already exists");
  } catch (error) {
    console.log("Error creating user role:", error);
  }
};

const initOwnerRole = async () => {
  try {
    const existingOwnerRole = await RoleModel.findOne({ name: "owner" });
    if (!existingOwnerRole) {
      ownerRole = await RoleModel.create({
        name: "owner",
        rights: Object.values(RightType),
      });
      console.log("Owner role created successfully");
      return;
    }
    console.log("Owner role already exists");
  } catch (error) {
    console.log("Error creating owner role:", error);
  }
};

const initMasterUser = async () => {
  try {
    const ownerRole = await RoleModel.findOne({ name: "owner" });

    // Check if the master user already exists based on a condition (e.g., username or email)
    const existingUser = await UserModel.findOne({
      username: process.env.MASTER_EMAIL,
    });

    if (!existingUser) {
      // If the master user does not exist, create it
      const { username, password, firstName, lastName, email } = {
        username: process.env.MASTER_EMAIL,
        email: process.env.MASTER_EMAIL,
        password: process.env.MASTER_PASSWORD,
        firstName: "Admin",
        lastName: "",
        role: ownerRole._id,
      };
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: ownerRole._id,
        status: STATUS.ACTIVE,
      });
      await user.save();
      console.log("Master user created");
      return;
    } else {
      if (!existingUser.role) {
        existingUser.role = ownerRole._id;
        await existingUser.save();
      }
      console.log("Master user already exists");
    }
  } catch (error) {
    console.log("Master user creation failed!", error);
  }
};

const initHomeConfig = async () => {
  try {
    const homeConfig = await HomeConfigModel.findOne();
    if (!homeConfig) {
      await HomeConfigModel.create({ name: "home", status: STATUS.ACTIVE });
      console.log("Home config created");
      return;
    }
    console.log("Home config already exists");
  } catch (error) {
    console.log("Home config creation failed!");
    console.log(error);
  }
};

const initPolicyConfig = async () => {
  try {
    const privacyPolicyConfig = await PolicyConfigModel.findOne({
      name: "privacy-policy",
    });
    if (!privacyPolicyConfig) {
      await PolicyConfigModel.create({
        name: "privacy-policy",
        status: STATUS.ACTIVE,
        description: "Privacy Policy",
      });
      console.log("Privacy Policy config created");
    } else {
      console.log("Privacy Policy already exists");
    }
  } catch (error) {
    console.log("Privacy Policy creation failed!");
    console.log(error);
  }

  try {
    const privacyPolicyConfig = await PolicyConfigModel.findOne({
      name: "terms-and-conditions",
    });
    if (!privacyPolicyConfig) {
      await PolicyConfigModel.create({
        name: "terms-and-conditions",
        status: STATUS.ACTIVE,
        description: "Terms and Conditions",
      });
      console.log("Terms and Conditions Policy config created");
    } else {
      console.log("Terms and Conditions Policy already exists");
    }
  } catch (error) {
    console.log("Terms and Conditions Policy creation failed!");
    console.log(error);
  }

  try {
    const privacyPolicyConfig = await PolicyConfigModel.findOne({
      name: "shipping-and-return-policy",
    });
    if (!privacyPolicyConfig) {
      await PolicyConfigModel.create({
        name: "shipping-and-return-policy",
        status: STATUS.ACTIVE,
        description: "Shipping and Return Policy",
      });
      console.log("Shipping and Return Policy config created");
    } else {
      console.log("Shipping and Return Policy already exists");
    }
  } catch (error) {
    console.log("Shipping and Return Policy creation failed!");
    console.log(error);
  }
};

const init = async () => {
  await initUserRole();
  await initOwnerRole();
  await initMasterUser();
  await initHomeConfig();
  await initPolicyConfig();
};

module.exports = {
  init,
};
