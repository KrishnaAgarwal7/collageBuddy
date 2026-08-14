const jwt = require("jsonwebtoken");
const User = require("../models/auth.model");
require("dotenv").config();

const requireAuth = (req, res, next) => {
  
    const bearer = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null;

    const token = req.cookies.jwt || bearer;

    if (!token) {
        return res.status(401).json({ message: "No token found" });
    }


    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {

        if (err) {
            console.log(err.message);

            return res.status(401).json({
                message: "Invalid token"
            });
        }

        try {

            const user = await User.findById(decodedToken.id);

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            req.user = user;

            next();

        } catch (err) {

            console.log(err);

            return res.status(500).json({
                message: "Server error"
            });

        }

    });

};

module.exports = { requireAuth };