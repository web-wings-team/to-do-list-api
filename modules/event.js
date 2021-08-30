const axios = require('axios')
module.exports = getDataEvent; 


let eventDataInMem = {};


function getDataEvent (req, res) {
    let contryCode =req.query.contryCode;
    let date=req.query.date;
    let year=date.split('-')[0]-1;
    let month=date.split('-')[1];
    let day=date.split('-')[2];
    
    let key=`contryCode${contryCode}date${date}`

    

    if (eventDataInMem[key] !== undefined) {
        console.log(' cache hit , data in cache memory');
        res.send(eventDataInMem[key]); 
    }


else{
        let eventUrl = `https://holidayapi.com/v1/holidays?pretty&key=${process.env.HOLIDAY_API_KEY}&country=${contryCode}&year=${year}&&month=${month}&day=${day}`
    try {
        axios.get(eventUrl).then((eventData) => {
            let eventArr=[];
                if(eventData.data.holidays.length){
             eventArr = eventData.data.holidays.map((elem) => {
                return new Event(elem);
            })
        }else{
            eventArr.push("no holiday in this day")
        }
            eventDataInMem[key]=eventArr;
            res.status(200).send(eventArr) 
        })

        } catch (error) {
            console.log(error);
            res.status(500).send('not found');
        }
    }
}            
    

// *******************************************************************************************************************************
class Event {
    constructor(elem) {
  this.nameOfEvent=elem.name;
    }
  }