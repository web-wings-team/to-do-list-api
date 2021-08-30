'use strict';

const mongoose = require("mongoose");

const sliceSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  email: String,
})

module.exports = sliceSchema; 