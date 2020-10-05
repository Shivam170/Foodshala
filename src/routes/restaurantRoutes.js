const express = require("express");
const router = new express.Router();
const authController = require("../controllers/authController");
const restaurantController = require("../controllers/restaurantController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/:id", restaurantController.getInfo);

module.exports = router;
