const RightType = {
  // User
  CREATE_USER: 100, // Create a new user (for self or others)
  UPDATE_OTHER_USER: 101, // Update other user's information
  UPDATE_USER: 102, // Update own user information
  DELETE_USER: 103, // Delete own user account
  DELETE_OTHER_USER: 104, // Delete other user's account
  VIEW_USER: 105, // View own user information
  VIEW_OTHER_USER: 106, // View other user's information
  UPDATE_USER_ROLE: 107,
  UPDATE_OTHER_USER_ROLE: 108,
  UPDATE_OTHER_USER_PASSWORD: 109,

  UPDATE_CART: 201,
  UPDATE_WISHLIST: 301,

  CREATE_ORDER: 401,
  UPDATE_ORDER: 402,

  ADMIN_ACCESS: 1,
};

module.exports = RightType;
