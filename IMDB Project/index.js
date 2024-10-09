import express from 'express';
import cors from 'cors';
import { searchMovies } from './scraper.js'; // Ensure this is correct
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: 'Scraping is fun!',
  });
});

// Updated route to use searchMovies dynamically
app.get('/search/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const movies = await searchMovies(title); // Pass the title to searchMovies function
    res.json(movies); // Respond with the list of movies
  } catch (error) {
    console.error('Error in /search/:title route:', error);
    res.status(500).send('Error fetching movies');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Optional: initial search to log movies on server start
searchMovies().then((movies) => {
  console.log('Movies found:', movies);
});