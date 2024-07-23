/*===============================================
Modules
===============================================*/
const mongoose = require("mongoose");

/*===============================================
The blog post schema
===============================================*/
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  tags: {
    type: Array
  },
  slug: {
    type: String,
    required: true,
  },
  createdAt: { // Will be inserted automatically
    type: Date,
    default: Date.now
  },
  updatedAt: { // Will be inserted automatically
    type: Date,
    default: Date.now
  },
  // IDs are created automatically
}); 

/*===============================================
Export
===============================================*/
module.exports = mongoose.model("Post", PostSchema);