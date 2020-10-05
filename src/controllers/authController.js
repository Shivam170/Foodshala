const Customer = require("../models/customerModel");
const Restaurant = require("../models/restaurantModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const sendToken = async (user, statusCode, res) => {
  const token = await user.generateAuthToken(user.role);
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  let User, role;
  if (req.baseUrl.toString() === "/restaurant") {
    User = Restaurant;
    role = "restaurant";
  } else {
    User = Customer;
    role = "customer";
  }

  const oldUser = await User.findOne({ email: req.body.email });
  if (oldUser) {
    return next(new AppError("Email is already registered", 400));
  }

  const newUser = await User.create({
    ...req.body,
    role: role,
  });

  await sendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  let User;
  if (req.baseUrl.toString() === "/restaurant") {
    User = Restaurant;
  } else User = Customer;

  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findByCredentials(email, password);

  await sendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.header("Authorization")) {
    token = req.header("Authorization").replace("Bearer ", "");
  }
  if (!token) {
    return next(new AppError("Please log in", 401));
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  let User;
  if (decoded.role.toString() === "restaurant") {
    User = Restaurant;
  } else {
    User = Customer;
  }
  const user = await User.findOne({ _id: decoded._id });
  if (!user) {
    return next(new AppError("The user does no longer exist"));
  }
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("No Authorization", 403));
    }
    next();
  };
};
