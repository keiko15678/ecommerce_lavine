const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  imgURL: { type: String },
  type: { type: String },
  gender: { type: String, required: true },
  describe: { type: String},
  productDetails: { type: Array},
  delivery: { type: String},
  specifications: { type: String},
  reviews: { type: Array},
  questions: { type: Array},
  slideshow: {type: Array},
  rating: {type: String},
  dateAdded: { type: Date, default: Date.now }
});

const item = mongoose.model("item", itemSchema);
module.exports = item