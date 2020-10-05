const express = require("express");
const router = new express.Router();
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

router.post(
  "/:id",
  authController.protect,
  authController.restrictTo("customer"),
  orderController.placeOrder
);
router.get(
  "/",
  authController.protect,
  authController.restrictTo("restaurant"),
  orderController.getOrders
);

module.exports = router;
