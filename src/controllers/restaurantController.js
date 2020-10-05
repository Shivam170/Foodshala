const Restaurant = require("../models/restaurantModel");
const Item = require("../models/itemModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getInfo = catchAsync(async (req, res, next) => {
  const data = await Restaurant.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: data,
  });
});
