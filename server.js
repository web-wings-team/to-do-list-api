"use strict";

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const server = express();
const PORT = process.env.PORT;
server.use(cors());
server.use(express.json());
const getDataWeather =require("./modules/weather");
const getDataMovies =require("./modules/movies");


// const mongoVar= process.env.MONGO_LINK  ;
mongoose.connect(`${process.env.DB_LINK}`, {useNewUrlParser: true, useUnifiedTopology: true,});


// const sliceSchema = require("./model/sliceSchema.js");
const {seedCollections}=require("./model/sliceSchema.js");
// seedCollections();
// const sliceModel = mongoose.model("slice", sliceSchema);
const {testHandler,getSlicesHandler,addSliceHandler,deletSliceHandler,updateSliceHandler}=require("./model/sliceController");


server.get("/", testHandler);
server.get("/getSlice", getSlicesHandler);
server.post("/addSlice", addSliceHandler);
server.delete("/deletSlice/:sliceId", deletSliceHandler);
server.put("/updateSlice/:sliceId", updateSliceHandler);
// ***********************************************************************************************************************************
// localhost:3002/weather?lon=-122.3300624&lat=47.6038321&cityName=amman
// server.get('/weather', getDataWeather);
// server.get('/movies', getDataMovies);

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
