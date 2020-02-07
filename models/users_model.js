const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String , required: true},
  firstName: { type: String},
  lastName: { type: String },
  address: { type: String, required: true  },
  state: { type: String, required: true },
  postal: { type: String, required: true },
  preference: { type: String },
  dateAdded: { type: Date, default: Date.now }
});

const user = mongoose.model("user", userSchema);
module.exports = user;