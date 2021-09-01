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
const getDataEvent =require("./modules/event");


// const mongoVar= process.env.MONGO_LINK ;
mongoose.connect(`${process.env.DB_LINK}`, {useNewUrlParser: true, useUnifiedTopology: true,});


const sliceSchema = require("./schema/sliceSchema.js");
const sliceModel = mongoose.model("slice", sliceSchema);
const contrySchema = require("./schema/contrySchema");
const contryModel = mongoose.model("contry", contrySchema);


server.get("/", testHandler);
server.get("/getSlice", getSlicesHandler);
server.post("/addSlice", addSliceHandler);
server.delete("/deletSlice/:sliceId", deletSliceHandler);
server.put("/updateSlice/:sliceId", updateSliceHandler);
// ***********************************************************************************************************************************
// localhost:3002/weather?cityName=amman
server.get('/weather', getDataWeather);
server.get('/movies', getDataMovies);
server.get('/event', getDataEvent);


//************************************************************************************************************************************
server.get("/getContry", getContryHandler);
server.post("/addContry", addContryHandler);
server.put("/updateContry/:ContryId", updateContryHandler);

function testHandler(req, res) {
  res.send("all is GOOD");
}

// localhost:3001/getSlice?email=a.nazzal&date=2021-8-30
function getSlicesHandler(req, res) {
  console.log("inside getSliceHandler func");
   let email = req.query.email;
  let date = req.query.date;
  sliceModel.find({ $and: [{ email},{date }] }, function (err, sliceData) {
    if (err) {
      console.log("error in getting the data");
    } else {
      console.log(sliceData);
      res.send(sliceData);
    }
  });
}
// localhost:3001/addSlice,{ }...
async function addSliceHandler(req, res) {
  console.log(req.body);
  let { title, description, date, email ,holiday} = req.body; 
 
  await sliceModel.create({ title, description, date, email ,holiday});
  // await sliceModel.create(req.body)
  sliceModel.find({ $and: [{ email }, { date }] }, function (err, sliceData) {
    if (err) {
      console.log("error in getting the data");
    } else {
      console.log(sliceData);
      res.send(sliceData);
    }
  });
  // getSlicesHandler(req, res); 
}
// localhost:3001/deletSlice/:sliceId?email=a.nzzal&date=currentdate

async function deletSliceHandler(req, res) {
  console.log("inside deletSliceHandler func");
  let sliceId = req.params.sliceId;
  sliceModel.remove({ _id: sliceId }, (error, deletedSlice) => {
    if (error) {
      console.log("error in deleteing the data");
    } else {
      console.log("data deleted", deletedSlice);
      getSlicesHandler(req, res); 
    }
  });
}
// localhost:3001/updateSlice/:sliceId

async function updateSliceHandler(req, res) {
  console.log("inside updateSliceHandler func");
  let sliceId = req.params.sliceId;
  let { title, description, date, email } = req.body;
  console.log(req.body);
  sliceModel.findByIdAndUpdate(
    sliceId,{ title, description, date, email },(error, updatedData) => {
      if (error) {
        console.log("error in updating the data");
      } else {
        console.log(updatedData, "Data updated!");

        sliceModel.find({ $and: [{ email }, { date }] }, function (err, data) {
          if (err) {
            console.log("error in getting the data");
          } else {
            console.log(data);
            res.send(data);
          }
        });
      }
    }
  );
}
function getContryHandler(req, res) {
  console.log("inside getCountryHandler func");
  let emailName2 = req.query.email;
  contryModel.find({ email: emailName2 }, function (err, contryData) {
    if (err) {
      console.log("error in getting the data");
    } else {
      console.log(contryData);
      res.send(contryData);
    }
  });
}
async function addContryHandler(req, res) {
  console.log("jnhvfjkdfnvkjdfn");
  console.log(req.body);
  let { countryName, email,countryCode,userName } = req.body; 
 
  await contryModel.create({ countryName, email,countryCode ,userName});
  // await sliceModel.create(req.body)
  getContryHandler(req, res); 
}
async function updateContryHandler(req, res) {
  console.log("inside updateSliceHandler func");
  let sliceId = req.params.sliceId;
  let { title, description, date, email } = req.body;
  console.log(req.body);
  contryModel.findByIdAndUpdate(
    sliceId,{ title, description, date, email },(error, updatedData) => {
      if (error) {
        console.log("error in updating the data");
      } else {
        console.log(updatedData, "Data updated!");

        contryModel.find({email: req.body.email}, function (err, data) {
          if (err) {
            console.log("error in getting the data");
          } else {
            console.log(data);
            res.send(data);
          }
        });
      }
    }
  );
}

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
