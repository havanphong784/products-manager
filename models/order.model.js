const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    cardId: String,
    userInfo: {
      fullName: String,
      phone: String,
      address: String,
    },
    products: [{
      productId: String,
      quantity: Number,
      discountPercentage: Number,
      price: Number,
    }]
  }
);

const Order = mongoose.model("Order", orderSchema, "order");
module.exports = Order;