const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected successfully to MongoDB");
  } catch (err) {
    console.log("Connection to mongoDB failed: ", err.message);
  }
};
module.exports = connectDB;
