"use strict";

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const server = express();
const PORT = process.env.PORT;
server.use(cors());
server.use(express.json());



// const mongoVar= process.env.MONGO_LINK  ;
mongoose.connect(`${process.env.DB_LINK}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const sliceSchema = require("./model/sliceSchema.js");
const sliceModel = mongoose.model("slice", sliceSchema);


server.get("/", testHandler);
server.get("/getSlice", getSlicesHandler);
server.post("/addSlice", addSliceHandler);
server.delete("/deletSlice/:sliceId", deletSliceHandler);
server.put("/updateSlice/:sliceId", updateSliceHandler);

function testHandler(req, res) {
  res.send("all is GOOD");
}




// localhost:3001/getSlice?emailName=

function getSlicesHandler(req, res) {
  console.log("inside getSliceHandler func");
  let emailName2 = req.query.email;
  sliceModel.find({ email: emailName2 }, function (err, sliceData) {
    if (err) {
      console.log("error in getting the data");
    } else {
      console.log(sliceData);
      res.send(sliceData);
    }
  });
}




// localhost:3001/addBook,{ }...

async function addSliceHandler(req, res) {
  console.log(req.body);
  let { title, description, status, email } = req.body; //Destructuring assignment .
 
  await sliceModel.create({ title, description, status, email });
  // await sliceModel.create(req.body)
  getSlicesHandler(req, res); // send data tso frontEnd......
}


// localhost:3001/deletSlice/:sliceId

async function deletSliceHandler(req, res) {
  console.log("inside deletSliceHandler func");

  let emailOwner = req.query.email;

  let sliceId = req.params.sliceId;
  sliceModel.remove({ _id: sliceId }, (error, deletedSlice) => {
    if (error) {
      console.log("error in deleteing the data");
    } else {
      console.log("data deleted", deletedSlice);
      sliceModel.find({ email: emailOwner }, function (err, data) {
        if (err) {
          console.log("error in getting the data");
        } else {
          console.log(data);
          res.send(data);
        }
      });
    }
  });
}




// localhost:3001/updateSlice/:sliceId

async function updateSliceHandler(req, res) {
  console.log("inside updateSliceHandler func");
  let sliceId = req.params.sliceId;
  let { title, description, status, email } = req.body;
  console.log(req.body);
  sliceModel.findByIdAndUpdate(
    sliceId,
    { title, description, status, email },
    (error, updatedData) => {
      //updatedData
      if (error) {
        console.log("error in updating the data");
      } else {
        console.log(updatedData, "Data updated!");

        sliceModel.find({email: req.body.email}, function (err, data) {
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
