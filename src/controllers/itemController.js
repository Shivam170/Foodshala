const Restaurant = require("../models/restaurantModel");
const Item = require("../models/itemModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.addItem = catchAsync(async (req, res, next) => {
  req.body.restaurantId = req.user._id;

  const item = await Item.create(req.body);
  res.status(201).json({
    status: "success",
    data: item,
  });
});

exports.getItemImage = catchAsync(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item || !item.itemImage) {
    return next(new AppError("No Item Found with that ID", 404));
  }
  res.set("Content-Type", "image/jpg");
  res.send(item.itemImage);
});

exports.uploadItemImage = catchAsync(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return next(new AppError("No Item Found with that ID", 404));
  }
  item.itemImage = req.file.buffer;
  await item.save();
  res.status(200).json({
    status: "success",
  });
});

exports.getAllItem = catchAsync(async (req, res, next) => {
  const restraunts = await Restaurant.find({});
  const items = await Item.find({});

  const newarr = items.map((item) => {
    const arr = restraunts.filter(
      (restaurant) => item.restaurantId.toString() == restaurant._id.toString()
    );
    const newItem = item.toObject();
    newItem.restaurantName = arr[0].restaurantName;
    newItem.address = arr[0].address;
    newItem.contact = arr[0].contact;
    return newItem;
  });
  res.status(200).json({
    status: "success",
    data: newarr,
  });
});

exports.getMyItem = catchAsync(async (req, res, next) => {
  await req.user.populate("items").execPopulate();
  res.status(200).json({
    status: "success",
    data: req.user.items,
  });
});
