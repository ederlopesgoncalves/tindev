const express = require('express');

const DevController = require('./controllers/DevController');
const LikeController = require('./controllers/LikeController');
const DislikeController = require('./controllers/DislikeController');

const routes = express.Router();

// GETs
routes.get('/devs', DevController.index); 

// POSTs
routes.post('/devs', DevController.store);
// Likes
routes.post('/devs/:devId/likes', LikeController.store);
// Dislike
routes.post('/devs/:devId/dislikes', DislikeController.store);

module.exports = routes;
