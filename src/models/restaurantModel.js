const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const restaurantSchema = new Schema(
  {
    restaurantName: {
      type: String,
      required: [true, "Please Fill in your restaurant name"],
      trim: true,
    },
    cuisine: {
      type: String,
      required: [true, "Please Fill in the cuisine"],
      trim: true,
    },
    email: {
      type: String,
      index: true,
      unique: true,
      required: [true, "Please provide your Email"],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minlength: 6,
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Please Fill in the address"],
      trim: true,
    },
    contact: {
      type: Number,
      required: [true, "Please provide your Contact No."],
      trim: true,
      minlength: 10,
      maxlength: 10,
    },
    role: {
      type: String,
      default: "customer",
      enum: ["customer", "restaurant"],
    },
    expiresIn: {
      type: Number,
      default: "10800",
    },
  },
  { timestamps: true }
);

restaurantSchema.virtual("items", {
  ref: "Item",
  localField: "_id",
  foreignField: "restaurantId",
});

restaurantSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "restaurantId",
});

restaurantSchema.methods.toJSON = function () {
  const restaurant = this;
  const restaurantObject = restaurant.toObject();
  delete restaurantObject.role;
  delete restaurantObject.password;
  return restaurantObject;
};

restaurantSchema.methods.generateAuthToken = async function (role) {
  const restaurant = this;
  const token = jwt.sign(
    { _id: restaurant._id.toString() , role},
    process.env.JWT_SECRET,
    {
      expiresIn: "10800 second",
    }
  );
  return token;
};

restaurantSchema.statics.findByCredentials = async (email, password) => {
  const restaurant = await Restaurant.findOne({ email });
  if (!restaurant) {
    throw new AppError("Incorrect Email or Password", 401);
  }
  const isMatch = await bcrypt.compare(password, restaurant.password);
  if (!isMatch) {
    throw new AppError("Incorrect Email or Password", 401);
  }
  return restaurant;
};

restaurantSchema.pre("save", async function (next) {
  const restaurant = this;

  if (restaurant.isModified("password")) {
    restaurant.password = await bcrypt.hash(restaurant.password, 12);
  }
  next();
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
