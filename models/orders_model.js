const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  detail: { type: Array, required: true },
  shipping: { type: Array},
  subtotal: { type: String, required: true  },
  firstName: { type: String},
  lastName: { type: String},
  paid: { type: Boolean, required: true },
  dateAdded: { type: Date, default: Date.now }
});

const order = mongoose.model("order", orderSchema);
module.exports = order;