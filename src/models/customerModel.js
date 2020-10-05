const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const customerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please Fill in your first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please Fill in your last name"],
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
    phone: {
      type: Number,
      required: [true, "Please provide your Phone No."],
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

customerSchema.methods.toJSON = function () {
  const customer = this;
  const customerObject = customer.toObject();
  delete customerObject.role;
  delete customerObject.password;
  return customerObject;
};

customerSchema.methods.generateAuthToken = async function (role) {
  const customer = this;
  const token = jwt.sign(
    { _id: customer._id.toString(), role },
    process.env.JWT_SECRET,
    {
      expiresIn: "10800 second",
    }
  );
  return token;
};

customerSchema.statics.findByCredentials = async (email, password) => {
  const customer = await Customer.findOne({ email });
  if (!customer) {
    throw new AppError("Incorrect Email or Password", 401);
  }
  const isMatch = await bcrypt.compare(password, customer.password);
  if (!isMatch) {
    throw new AppError("Incorrect Email or Password", 401);
  }
  return customer;
};

customerSchema.pre("save", async function (next) {
  const customer = this;

  if (customer.isModified("password")) {
    customer.password = await bcrypt.hash(customer.password, 12);
  }
  next();
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
