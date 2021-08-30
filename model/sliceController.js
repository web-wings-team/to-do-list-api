const { tasksModel } = require("./sliceSchema");
function testHandler(req, res) {
  res.send("all is GOOD");
}

// localhost:3001/getSlice?email=a.nazzal&date=2021-8-30
function getSlicesHandler(req, res) {
  console.log("inside getSliceHandler func");
  // let email = req.query.email;
  // let date = req.query.date;
  let { email,date  } = req.query;
  //{ $and: [ {title:"Book1"}, {title:"book333"} ] }
  tasksModel.find({ $and: { email ,  date } }, function (err, sliceData) {
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
  let { title, description, date, email } = req.body;

  await tasksModel.create({ title, description, date, email });
  // await tasksModel.create(req.body);
  // tasksModel.find({ $and: [{ email }, { date }] }, function (err, sliceData) {
  //   if (err) {
  //     console.log("error in getting the data");
  //   } else {
  //     console.log(sliceData);
  //     res.send(sliceData);
  //   }
  // });

  getSlicesHandler(req, res); 

}

// localhost:3001/deletSlice/:sliceId ,params
// localhost:3001/deletSlice/:sliceId?email=a.nzzal&date=currentdate

async function deletSliceHandler(req, res) {
  console.log("inside deletSliceHandler func");
  let sliceId = req.params.sliceId;
  let email = req.query.email;
  let date=req.query.date;
  tasksModel.remove({ _id: sliceId }, (error, deletedSlice) => {
    if (error) {
      console.log("error in deleteing the data");
    } else {
      console.log("data deleted", deletedSlice);
      //{ $and: [ {email}, {date} ] }
      //deletedSlice.email;
      tasksModel.find({ $and: [{ email }, { date }] }, (error, Slices) => {
        if (error) {
          res.send("Error getting data")
        }
        else {
          res.send(Slices);
        }
      })
      // getSlicesHandler(req, res); 
    }
  });
}

// localhost:3001/updateSlice/:sliceId
//localhost:3001/updateSlice/61290aaf7961c8b994543c97 , params

async function updateSliceHandler(req, res) {
  console.log("inside updateSliceHandler func");
  let sliceId = req.params.sliceId;
  let { title, description, date, email } = req.body;
  console.log(req.body);
  tasksModel.findByIdAndUpdate(
    sliceId, { title, description, date, email }, (error, updatedData) => {
      if (error) {
        console.log("error in updating the data");
      } else {
        console.log(updatedData, "Data updated!");

        tasksModel.find({ $and: [{ email }, { date }] }, function (err, data) {
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
module.exports = {
  testHandler,
  getSlicesHandler,
  addSliceHandler,
  deletSliceHandler,
  updateSliceHandler
}