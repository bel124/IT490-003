const express = require('express');
const bodyParser = require('body-parser');

const axios = require('axios');
const http = require('http');

const app = express();
app.set("view engine", "pug");
const server = require('http').Server(app);

const port = 8080;

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('b2af00c65872484fa5812036eca4239b');


// Endpoint to get newsroom
app.get('/newsroom', async (req, res) => {
    const query = req.query
    var country = 'us'
    var q = null
    var p = 1
    if ('country' in query) {
        country = query.country;
    }

    if ('q' in query) {
        q = query.q
    }

    if ('p' in query) {
        p = query.p
    }


    newsapi.v2.topHeadlines({
        category: 'sports',
        language: 'en',
        q: q,
        page: p,
        country: country
        }).then(response => {
        if (response.status == "ok") {
            const articles = response.articles;
            const _articles = []
            for (const article of articles) {
                _articles.push({
                    "title": (article.title ? article.title : "").replace(/[""]/g, "'"),
                    "imageURL": (article.urlToImage ? article.urlToImage : "").replace(/[""]/g, "'"),
                    "articleURL": (article.url ? article.url : "").replace(/[""]/g, "'"),
                    "source": (article.source.name ? article.source.name : "").replace(/[""]/g, "'")
                })
            }

            res.render("newsroom", {articles: JSON.stringify(_articles), totalPages: Math.ceil(response.totalResults/20), currentPage: p, country: country, query: q});
        } else {
            res.status(503);
            res.json({"error": response});
        }
    }).catch(function(error){
        res.status(403);
        res.json({"error": error});
    });
});

server.listen(port, (err) => {
	if (err) {
		throw err;
	}
	console.log('Server Started');
});
