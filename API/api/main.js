//
const express = require('express');
const bodyParser = require('body-parser');
const talkjs = require('talkjs-node');
const axios = require('axios');
const http = require('http');

const app = express();
app.set("view engine", "pug");
const server = require('http').Server(app);

const port = 8080;

// TalkJS Setup
const appId = 't0pywPKp'
const apiKey = 'sk_test_HSiNEy4kg1VVKwk9BhmnYZie'
const client = new talkjs.TalkJS({
    appId: appId,
    apiKey: apiKey
})

// Axios Setup
const httpAgent = new http.Agent({ keepAlive: true });
const axioInstance = axios.create({
    httpAgent,
    baseURL: `https://api.talkjs.com/v1/${appId}`,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    }
})

app.use(bodyParser.urlencoded({ extended: true }));


// Endpoint to get chatroom
app.get('/chatroom', async (req, res) => {
    const query = req.query
    if ('userId' in query && 'name' in query) {
        var id = query.userId;
        var name = query.name;

        var users = []
        for await (const user of client.users.list()) {
            users.push({name: user.name, id: user.id})
        }

        res.render("chatroom", {appId: appId, user_id: id, name: name, users: JSON.stringify(users)});
    }
    else {
        res.status(403);
        res.json({"error": "'userId' & 'name' field is required!"});
    }
});

// Endpoint to create chatroom
app.post('/chatroom', (req, res) => {
    const body = req.body
    if ('userId' in body && 'otherUserId' in body) {
        const meId = body.userId
        const userId = body.otherUserId
        const conversationId = talkjs.oneOnOneId(meId, userId)
        const participants = [meId, userId]

        var createConPromise = client.conversations.create(conversationId, {participants: participants})
        createConPromise.then(function(v) {
            const data = [{
                text: "Hey there! How are you?",
                type: "UserMessage",
                sender: meId
            }]

            axioInstance.post(`/conversations/${conversationId}/messages`, data)
            .then(function (response) {
                res.send(200);
            })
            .catch(function (error) {
                res.status(403);
                res.json({"error": error});
            });
        }).catch(function(error){
            res.status(403);
            res.json({"error": error});
        })
    }
    else {
        res.status(403);
        res.json({"error": "'userId' & 'otherUserId' field is required!"});
    }
});

// Endpoint to get users
app.get('/users', async (req, res) => {
    var users = []
    for await (const user of client.users.list()) {
        users.push(user)
    }
    res.status(200);
    res.json({"users": users});
});

// Endpoint to create chatroom
app.post('/users', async (req, res) => {
    const body = req.body
    if ('user_id' in body && 'name' in body) {
        const user_id = body.user_id
        const name = body.name
        console.log("Creating new user:", name)

        var createUserPromise = client.users.create(user_id, {"name": name})
        createUserPromise.then(function(v) {
            res.status(200);
            res.json({"user_id": user_id, "name": name});
        }).catch(function(error){
            res.status(403);
            res.json({"error": error});
        })
    } else {
        res.status(403);
        res.json({"error": "'user_id' & 'name' field is required!"});
    }
});

server.listen(port, (err) => {
	if (err) {
		throw err;
	}
	console.log('Server Started');
});
