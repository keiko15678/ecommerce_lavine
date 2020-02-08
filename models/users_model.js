const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String , required: true},
  firstName: { type: String},
  lastName: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  postal: { type: String },
  country: { type: String },
  preference: { type: String },
  dateAdded: { type: Date, default: Date.now }
});

const user = mongoose.model("user", userSchema);
module.exports = user;