const express = require("express");

const router = express.Router();

const adminController =
    require("../controllers/admin.controller");

const authMiddleware =
    require("../middleware/auth.middleware");

const adminMiddleware =
    require("../middleware/admin.middleware");



router.get(
    "/users",
    authMiddleware.requireAuth,
    adminMiddleware.adminOnly,
    adminController.getAllUsers
);


router.patch(
    "/users/:id/block",
    authMiddleware.requireAuth,
    adminMiddleware.adminOnly,
    adminController.blockUser
);



router.patch(
    "/users/:id/unblock",
    authMiddleware.requireAuth,
    adminMiddleware.adminOnly,
    adminController.unBlockUser
);


module.exports = router;