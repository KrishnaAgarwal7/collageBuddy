const { Router } = require('express');
const routes = Router();
const lostAndFoundController = require('../controllers/lostAndFound.controller');
const upload = require("../middleware/upload.middleware");

const { requireAuth } = require('../middleware/auth.middleware')
routes.post('/' , requireAuth ,
  upload.single("image"),
  lostAndFoundController.createPost)
routes.get('/' ,  lostAndFoundController.getAllPost)
routes.get('/my-posts' , requireAuth , lostAndFoundController.getMyPosts)
routes.get('/:id' , requireAuth , lostAndFoundController.getSinglePost)
routes.put('/:id' , requireAuth , lostAndFoundController.updatePost)
module.exports = routes;