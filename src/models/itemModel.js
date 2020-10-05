const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  dishName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  itemImage: {
    type: Buffer,
  },
});

itemSchema.methods.toJSON = function () {
  const item = this;
  const itemObject = item.toObject();
  delete itemObject.itemImage;
  return itemObject;
};

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
