const express = require('express')
const { Router } = express;
const router = Router();
const userController = require('../controllers/user.controller')
const { requireAuth } = require('../middleware/auth.middleware')
router.put("/complete-profile" , requireAuth , userController.user_profile)
router.get(
    "/me",
    requireAuth,
    userController.getCurrentUser
);
module.exports = router;