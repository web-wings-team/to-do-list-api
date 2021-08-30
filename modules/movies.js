const axios = require('axios')
module.exports = getDataMovies; 


let moviesDataInMem = {};


function getDataMovies (req, res) {
    console.log(req.query.cityName);
    let cityName =req.query.cityName;

    

    if (moviesDataInMem[cityName] !== undefined) {
        console.log(' cache hit , data in cache memory');
        res.send(moviesDataInMem[cityName]);
    }


else{
        let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityName}&include_adult=false`
    try {
        axios.get(movieUrl).then((movieData) => {
            console.log(movieData);

            let weaArr = movieData.data.results.map((elem) => {
                return new Movie(elem);
            })
            moviesDataInMem[cityName]=weaArr;
            res.status(200).send(weaArr) 
        })

        } catch (error) {
            console.log(error);
            res.status(500).send('not found');
        }
    }
}            
    

// *******************************************************************************************************************************
class Movie {
    constructor(elem) {
      this.title = elem.title;
      this.date =elem.release_date;
      this.overview =elem.overview;
      this.vote =elem.vote_count;
      this.avgVote = elem.vote_average;
      this.src = `https://image.tmdb.org/t/p/original${elem.poster_path}`;
    }
  }