const axios = require("axios");
module.exports = getDataMovies;

let moviesDataInMem = {};

async function getDataMovies(req, res) {
  console.log(req.query.cityCode);
  let cityCode = req.query.cityCode;
  let cityDate = req.query.cityDate;

  let year = cityDate.split("-")[0];
  let month = cityDate.split("-")[1];
  let newMounth = parseInt(month, 10) + 2;
  let newOne = `${newMounth}`;
  let day = cityDate.split("-")[2];

  let newDate = `${year}-${newOne}-${day}`;
  console.log("shamikh date", newDate);

  if (moviesDataInMem[cityCode] !== undefined) {
    console.log(" cache hit , data in cache memory");
    res.send(moviesDataInMem[cityCode]);
  } else {
    try {
      let movieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIE_API_KEY}&region=${cityCode}&release_date.gte=${cityDate}&release_date.lte=${newDate}&with_release_type=2|3`;
        axios.get(movieUrl).then((movieData) => {
         if(movieData.data.results.length===0){
            let movieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIE_API_KEY}&region=gb&release_date.gte=${cityDate}&release_date.lte=${newDate}&with_release_type=2|3`;
            axios.get(movieUrl).then((movieData) => {

                let weaArr = movieData.data.results.map((elem) => {
                    return new Movie(elem);
                });
                moviesDataInMem[cityCode] = weaArr;
                res.status(200).send(weaArr);
            })

         }else{
        console.log(movieData);
        let weaArr = movieData.data.results.map((elem) => {
          return new Movie(elem);
        });
        moviesDataInMem[cityCode] = weaArr;
        res.status(200).send(weaArr);
         }
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("not found");
    }
  }
}

// *******************************************************************************************************************************
class Movie {
  constructor(elem) {
    this.title = elem.title;
    this.date = elem.release_date;
    this.overview = elem.overview;
    this.src = `https://image.tmdb.org/t/p/original${elem.poster_path}`;
  }
}