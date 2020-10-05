const express = require("express");
const router = new express.Router();
const itemController = require("../controllers/itemController");
const authController = require("../controllers/authController");
const multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

router
  .route("/:id/image")
  .get(itemController.getItemImage)
  .post(
    authController.protect,
    authController.restrictTo("restaurant"),
    upload.single("image"),
    itemController.uploadItemImage
  );

router.post(
  "/",
  authController.protect,
  authController.restrictTo("restaurant"),
  itemController.addItem
);

router.get("/", itemController.getAllItem);
router.get(
  "/restaurant",
  authController.protect,
  authController.restrictTo("restaurant"),
  itemController.getMyItem
);

module.exports = router;
