const axios = require('axios')
module.exports = getDataWeather;



let weatherDataInMem = {};



function getDataWeather(req, res) {
    let cityLonQ = Number(req.query.lon);
    let cityLatQ = Number(req.query.lat);
    let cityKey=`lon${cityLonQ}lat${cityLatQ}`

    // https://api.weatherbit.io/v2.0/forecast/daily?key=<KEY&lat=<LAT&lon=<LON&days=NUM_OF_DAYS3
    
    if (weatherDataInMem[cityKey] !== undefined) {
        if (Date.now()- weatherDataInMem[cityKey].time < 86400000){
        console.log(' cache hit , data in cache memory');
        res.send(weatherDataInMem[cityKey].data);
        }else{
            console.log("no data");
            getDAta (cityKey,cityLonQ,cityLatQ,res);
        }
    }
    else {
        getDAta (cityKey,cityLonQ,cityLatQ,res);
    }
}



// ***********************************************************************************************************************************

class CityWeather {
    constructor(elem) {
        this.date = elem.valid_date;
        this.descreption = `Low of ${elem.low_temp}, high of ${elem.max_temp} with ${elem.weather.description}`
    }
}


// ***********************************************************************************************************************************
function getDAta (cityKey,cityLonQ,cityLatQ,res){
    let weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${cityLatQ}&lon=${cityLonQ}&days=${5}`
    console.log(' cache miss , send req to weatherbit API');
    try {
        axios.get(weatherUrl).then((weatherData) => {
        
            let weaArr = weatherData.data.data.map((elem) => {
                return new CityWeather(elem);
            })
            weatherDataInMem[cityKey]={data:weaArr,time:Date.now()};
            res.status(200).send(weaArr);
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('not found');
    }
}