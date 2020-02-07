const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscribeSchema = new Schema({
  email: { type: String, required: true },
  preference: { type: String }
});

const subscribe = mongoose.model("subscribe", subscribeSchema);
module.exports = subscribe;