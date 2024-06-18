import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import User from '../models/user.models.js';

export const AuthMiddleware = {

    async verifyToken(req,  res, next) {
        const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;

        if (!token) {
            return res.status(403).json({
                message: "No token provided!"
            });
        }

        jwt.verify(token, config.jwtKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Unauthorized!"
                });
            }
            req.userId = decoded.id;
            next();
        });
    },
    async isAdmin(req, res, next) {
        try {
            const user = await User.findByPk(req.userId);

            if (user) {
                next();
                return;
            }
            res.status(403).json({
                message: "Require Admin Role!"
            });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    },
}