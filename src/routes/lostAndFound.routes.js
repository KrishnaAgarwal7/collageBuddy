const { Router } = require('express');
const routes = Router();
const lostAndFoundController = require('../controllers/lostAndFound.controller');

const { requireAuth } = require('../middleware/auth.middleware')
routes.post('/' , requireAuth , lostAndFoundController.createPost)
routes.get('/' , requireAuth , lostAndFoundController.getAllposts)
module.exports = routes;