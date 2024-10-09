/* ============== THE INDEX.JS IS FOR THE BACKEND LOGIC  ========== */

import express from "express";
import cors from "cors";

import {searchMovies} from "./scraper.js"
searchMovies().then((movies) => {
    console.log("Movies found:", movies)
})

const port = 3000 || process.env.PORT;
const app = express();

app.get("/", (req, res) => {
    res.json({
        message: "Scraping is fun!"
    })
})

app.get("/search/:title", (req, res) => {
    scraper
    .searchMovies(req.params.title)
    .then(movies => {
        res.json(movies)
    })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
