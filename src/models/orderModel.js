const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const orderSchema = new Schema(
  {
    customerName: {
      type: String,
      required: [true, "Please Provide customer name"],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, "Please provide your Email"],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid Email"],
    },
    customerPhone: {
      type: Number,
      required: [true, "Please provide Phone No."],
      trim: true,
      minlength: 10,
      maxlength: 10,
    },
    dishName: {
      type: String,
      required: [true, "Please provide dish name"],
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
