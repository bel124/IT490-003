const express = require('express');
const bodyParser = require('body-parser');

const axios = require('axios');
const http = require('http');

const app = express();
app.set("view engine", "pug");
const server = require('http').Server(app);

const port = 8080;

// Axios Setup
const httpAgent = new http.Agent({ keepAlive: true });
const axioInstance = axios.create({
    httpAgent,
    baseURL: `https://api-football-v1.p.rapidapi.com/v2`,
    timeout: 60000,
    headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key": "51658941cdmsh3ba3c1a952a0477p1fe518jsn0d83f7bbe032"
    }
})


// Endpoint to get scores
app.get('/scores', async (req, res) => {
    axios({
        "method":"GET",
        "url":"https://sportspage-feeds.p.rapidapi.com/games",
        "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":"sportspage-feeds.p.rapidapi.com",
        "x-rapidapi-key":"51658941cdmsh3ba3c1a952a0477p1fe518jsn0d83f7bbe032"
        }
        })
        .then((response)=>{
            const results = response.data.results;
            const _results = []

            for (const result of results) {
                _results.push({
                    "summary": `${result.summary}`,
                    "league": `${result.details.league}`,
                    "season": `${result.details.season}`,
                    "status": `${result.status}`,
                    "venue": `${result.venue.name} - ${result.venue.city}, ${result.venue.state}`
                })
            }

            res.render("scores", {results: JSON.stringify(_results)});
        })
        .catch((error)=>{
            res.status(403);
            res.json({"error": error});
        })
});

server.listen(port, (err) => {
	if (err) {
		throw err;
	}
	console.log('Server Started');
});
