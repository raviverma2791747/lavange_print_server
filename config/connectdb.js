const mongoose = require("mongoose");

const connectDB = async (DATABBASE_URL,DB_NAME) => {
    try {
        const DB_OPTIONS = {
            dbName: DB_NAME,
        }
        await mongoose.connect(DATABBASE_URL,DB_OPTIONS);
        console.log("Database Connected Successfully!");
    } catch (error) {
        console.error(`Database Error: ${error.message}`);
    }
};

module.exports = connectDB;