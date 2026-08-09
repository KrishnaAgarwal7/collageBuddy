const { Router } = require('express');
const routes = Router();
const authController = require('../controllers/auth.controller');

routes.post('/login' , authController.login_post);
routes.post('/signup' , authController.signup_post);

module.exports = routes;


