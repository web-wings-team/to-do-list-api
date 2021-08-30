'use strict';

const mongoose = require("mongoose");

const contrySchema = new mongoose.Schema({
  contry: String,
  contryCode:String,
  email: String,
})

module.exports = contrySchema; 