const axios = require('axios')
module.exports = getDataMovies; 


let moviesDataInMem = {};


async function getDataMovies (req, res) {
    console.log(req.query.cityCode);
    let cityCode =req.query.cityCode;

    

    if (moviesDataInMem[cityCode] !== undefined) {
        console.log(' cache hit , data in cache memory');
        res.send(moviesDataInMem[cityCode]);
    }


else{
        let movieUrl =`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=whiplash&language=${cityCode}-${cityCode}&region=${cityCode}`;
    try {
     await axios.get(movieUrl).then((movieData) => {
            console.log(movieData);

            let weaArr = movieData.data.results.map((elem) => {
                return new Movie(elem);
            })
            moviesDataInMem[cityCode]=weaArr;
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