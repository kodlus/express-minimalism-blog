/*===============================================
Module
===============================================*/
const mongoose = require("mongoose");

/*===============================================
The blog post schema
===============================================*/
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});

/*===============================================
Export
===============================================*/
module.exports = mongoose.model("User", UserSchema);