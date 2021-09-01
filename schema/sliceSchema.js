'use strict';

const mongoose = require("mongoose");

const sliceSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  email: String,
  date:String,
  holiday:String,
})

module.exports = sliceSchema; 