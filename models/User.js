const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true},
  district: { type: String, required: true },
  pincode: { type: Number, required: true, min: 100000, max: 999999 },
  mobile: { type: Number, required: true },
  email: { type: String, unique: true, sparse: true }, // <-- not required, but unique & sparse
  date: { type: Date, default: Date.now },
 
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);