const Restaurant = require("../models/restaurantModel");
const Item = require("../models/itemModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Order = require("../models/orderModel");

exports.placeOrder = catchAsync(async (req, res, next) => {
  const user = req.user;
  const item = await Item.findById(req.params.id);

  const obj = {
    customerName: user.firstName + " " + user.lastName,
    customerEmail: user.email,
    customerPhone: user.phone,
    dishName: item.dishName,
    amount: item.price,
    restaurantId: item.restaurantId,
  };
  const order = await Order.create(obj);
  res.status(201).json({
    status: "success",
    data: order,
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  await req.user.populate("orders").execPopulate();
  res.status(200).json({
    status: "success",
    data: req.user.orders,
  });
});
