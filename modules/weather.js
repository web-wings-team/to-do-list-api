const axios = require('axios')
module.exports = getDataWeather;



let weatherDataInMem = {};


async function getDataWeather(req, res) {

    let searchCity=req.query.cityName;
    let locURL = `https://eu1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&q=${searchCity}&format=json`;

    let resultData = await axios.get(locURL);
    let cityData    =  resultData.data[0];

    
    let cityLonQ = Number(cityData.lon);
    let cityLatQ = Number(cityData.lat);
    
    let cityKey=`lon${cityLonQ}lat${cityLatQ}`

    // https://api.weatherbit.io/v2.0/forecast/daily?key=<KEY&lat=<LAT&lon=<LON&days=NUM_OF_DAYS3
    
    if (weatherDataInMem[cityKey] !== undefined) {
        if (Date.now() - weatherDataInMem[cityKey].time < 3600000){
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
        this.descreption =  elem.weather.description;
        this.timezone = elem.timezone;
        this.full=elem;
    }
}
// ***********************************************************************************************************************************
function getDAta (cityKey,cityLonQ,cityLatQ,res){
    let weatherUrl = `https://api.weatherbit.io/v2.0/current?lon=${cityLonQ}&lat=${cityLatQ}&key=${process.env.WEATHER_API_KEY}`
    console.log(' cache miss , send req to weatherbit API');
    try {
        axios.get(weatherUrl).then((weatherData) => {
            // console.log(weatherData.data);
        // let x =weatherData.data.country_code;
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