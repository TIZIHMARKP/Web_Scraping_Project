import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

 async function searchMovies(title) {
  try {
    console.log(`Searching movies with title: ${title}`);

    // Adjust the URL to include the search title, using IMDb's search functionality
    const searchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(title)}&s=tt&ttype=ft&ref_=fn_ft`;
    const response = await fetch(searchUrl);
    const body = await response.text();

    const $ = cheerio.load(body);
    const movies = [];

    // Adjust the selector to match IMDb's search results page
    $('section.ipc-page-section.ipc-page-section--base.sc-e8e4ce7-0.fkWWaa').each((i, element) => {
      const $element = $(element);
      const movie = {
        title: $element.find('a.ipc-metadata-list-summary-item__t').text(),
        link: `https://www.imdb.com${$element.find('.result_text a').attr('href')}`,
        image: $element.find('img.ipc-image').attr('src'),
      };
      movies.push(movie);
    });

    return movies;

  } catch (error) {
    console.error('Error in searchMovies:', error);
    throw error; // Propagate error to be caught in route handler
  }
}

export default searchMovies