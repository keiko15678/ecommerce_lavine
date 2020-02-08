const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cmsUserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String , required: true},
  dateAdded: { type: Date, default: Date.now }
});

const cmsUser = mongoose.model("cms_user", cmsUserSchema);
module.exports = cmsUser;