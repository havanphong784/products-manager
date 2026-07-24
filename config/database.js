require('dotenv').config();

const mongodb = require("mongoose");
module.exports.connection = async () => {
  try {
    await mongodb.connect(process.env.MONGODB_URI);
    console.log("Kết nối MongoDB thành công");
  } catch (err) {
    console.error(err);
  }
}