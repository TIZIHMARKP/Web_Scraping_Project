// /* ================     CODE TO SCRAP DATA FROM IMDB WEBSITE       ================ */

// import fetch from "node-fetch";
// import * as cheerio from "cheerio";



// const url = "https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=";

// function searchMovies(searchTerm) {
//     return fetch(`${url}${searchTerm}`) //this will make a request for the search results of that movie 
//     .then(response => response.text()); //here we want to turn the report into text
// }


// searchMovies('star wars')
// .then(body => {
//     const $ = cheerio.load(body);

//      //returns elements but skips as it goes
//      const movies = [];
//      $('section.ipc-page-section.ipc-page-section--base.sc-e8e4ce7-0.fkWWaa').each(function(i, element) {
//          const $element = $(element);
         
//          $element.find('ul li').each(function() {
//              const $li = $(this);
//              const movie = {
//                  image: $li.find('img.ipc-image').attr('src'),
//                  title: $li.find('a.ipc-metadata-list-summary-item__t').text()
//              }
//              movies.push(movie);
//          });
//      }); 
//     return(movies);

// })

// export default searchMovies

// // module.export = {
// //     searchMovies //this is gonna make it available to the ouside world so that it can be used in an express route
// // }

export function searchMovies(){
    try {
    console.log("searching movies...")
    .then(body => {
            const $ = cheerio.load(body);
        
             //returns elements but skips as it goes
             const movies = [];
             $('section.ipc-page-section.ipc-page-section--base.sc-e8e4ce7-0.fkWWaa').each(function(i, element) {
                 const $element = $(element);
                 
                 $element.find('ul li').each(function() {
                     const $li = $(this);
                     const movie = {
                         image: $li.find('img.ipc-image').attr('src'),
                         title: $li.find('a.ipc-metadata-list-summary-item__t').text()
                     }
                     movies.push(movie);
                 });
             }); 
            return(movies);
        
        })
    } catch (error) {
        console.error("error in searchmovies:", error)
    }
}