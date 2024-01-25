const RightType = {
    // User
    CREATE_USER: 'CREATE_USER',                    // Create a new user (for self or others)
    UPDATE_OTHER_USER: 'UPDATE_OTHER_USER',        // Update other user's information
    UPDATE_USER: 'UPDATE_USER',                    // Update own user information
    DELETE_USER: 'DELETE_USER',                    // Delete own user account
    DELETE_OTHER_USER: 'DELETE_OTHER_USER',        // Delete other user's account
    VIEW_USER: 'VIEW_USER',                        // View own user information
    VIEW_OTHER_USER: 'VIEW_OTHER_USER',            // View other user's information
    UPDATE_USER_ROLE: "UPDATE_USER_ROLE",
    UPDATE_OTHER_USER_ROLE: "UPDATE_OTHER_USER_ROLE",
    UPDATE_OTHER_USER_PASSWORD: "UPDATE_OTHER_USER_PASSWORD",

    UPDATE_CART: "UPDATE_CART",
    UPDATE_WISHLIST: "UPDATE_WISHLIST",

    CREATE_ORDER: "CREATE_ORDER",
    UPDATE_ORDER: "UPDATE_ORDER",

    VIEW_CONFIG: "VIEW_CONFIG",
    UPDATE_CONFIG: "UPDATE_CONFIG",

    ADMIN_ACCESS : "ADMIN_ACCESS",
}

module.exports = RightType;