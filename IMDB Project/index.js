import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const app = express();
const port = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
      message: 'Scraping is fun!',
    });
  });


// Endpoint to search movies by title
app.get('/search/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const searchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(title)}&s=tt&ttype=ft&ref_=fn_ft`;
    const response = await fetch(searchUrl);
    const body = await response.text();

    const $ = cheerio.load(body);
    const movies = [];

    $('.ipc-metadata-list-summary-item.ipc-metadata-list-summary-item--click.find-result-item.find-title-result').each((i, element) => {
      const $element = $(element);
      const movie = {
        title: $element.find('a.ipc-metadata-list-summary-item__t').text(),
        // id: $element.find('ipc-metadata-list-summary-item__t').attr('href').split('/')[2],
        link: `https://www.imdb.com${$element.find('ipc-metadata-list-summary-item__t').attr('href')}`,
        image: $element.find('img.ipc-image').attr('src'),
      };
      movies.push(movie);
    });

    res.json(movies);
  } catch (error) {
    console.error('Error in /search/:title:', error);
    res.status(500).json({ message: 'Error searching for movies' });
  }
});

// Endpoint to get detailed information about a specific movie
app.get('/movie/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const movieUrl = `https://www.imdb.com/title/${movieId}/`;
    const response = await fetch(movieUrl);
    const body = await response.text();

    const $ = cheerio.load(body);
    const movie = {
      title: $('h1').text().trim(),
      mpaaRating: $('span[title="MPAA Rating"]').text().trim(),
      runtime: $('time').first().text().trim(),
      genres: $('div.subtext a[href*="/search/"]').map((i, el) => $(el).text().trim()).get(),
      releaseDate: $('a[title="See more release dates"]').text().trim(),
      imdbRating: $('span[itemprop="ratingValue"]').text().trim(),
      poster: $('div.poster img').attr('src'),
      summary: $('div.summary_text').text().trim(),
      directors: $('span[itemprop="director"] a').map((i, el) => $(el).text().trim()).get(),
      writers: $('span[itemprop="creator"] a').map((i, el) => $(el).text().trim()).get(),
      stars: $('span[itemprop="actors"] a').map((i, el) => $(el).text().trim()).get(),
      storyline: $('div#titleStoryLine div p span').text().trim(),
      companies: $('span[itemtype="http://schema.org/Organization"]').map((i, el) => $(el).text().trim()).get(),
    };

    res.json(movie);
  } catch (error) {
    console.error('Error in /movie/:id:', error);
    res.status(500).json({ message: 'Error fetching movie details' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});