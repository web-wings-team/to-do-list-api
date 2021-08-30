// 'use strict';

const mongoose = require("mongoose");

const sliceSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  email: String,
})

const tasksModel = mongoose.model('tasks', sliceSchema);

const seedCollections = () => {
  const task1 = new tasksModel({
    title: "Task6",
    description: "Task6",
    date: "2021-8-30",
    email: "a.nazzal1995@gmail.com"

  })
  const task2 = new tasksModel({
    title: "Task66",
    description: "Task66",
    status: "2021-8-30",
    email: "a.nazzal1995@gmail.com"
  })
  const task3 = new tasksModel({
    title: "Task3",
    description: "Task13",
    date: "2021-8-30",
    email: "a.nazzal1995@gmail.com"
  })

  task1.save();
  task2.save();
  task3.save();

}
// seedCollections();

module.exports = {
  tasksModel,
  seedCollections
}