'use strict';

const mongoose = require("mongoose");

const contrySchema = new mongoose.Schema({
  countryName: String,
  countryCode:String,
  email: String,
  userName:String,
})

module.exports = contrySchema; 