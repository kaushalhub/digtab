const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const UserSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  mobile: {
    type: String,
    require: true
  },
  collagename: {
    type: String,
    require: true
  },
  gender: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model("users", UserSchema);
