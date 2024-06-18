import bcryptjs from "bcryptjs";
import { Op } from "sequelize";
import jwt from 'jsonwebtoken';
import { config } from "../../config/index.js";
import { sequelize } from "../../../db/index.js";
import User from "../../models/user.models.js";
import RefreshToken from "../../models/refresh.token.models.js";

export const AuthController = {

    async signUp(req, res) {
        const transaction = await sequelize.transaction();

        try {
            const { username, password } = req.body;
            const hashedPassword = bcryptjs.hashSync(password, 8);

            const userExists = await User.findOne({
                where: {
                    [Op.or]: [
                        { username: username },
                    ]
                }
            });

            if (userExists) {
                await transaction.rollback();
                return res.status(409).json({
                    message: "User already exists"
                });
            } else {
                const user = await User.create({
                    username,
                    password: hashedPassword,
                }, { transaction });

                await transaction.commit();
                return res.status(201).json({
                    message: "User created",
                    users: {
                        id: user.id,
                        username: user.username,
                    }
                });
            }
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    },

    async signIn(req, res) {

        try {
            if (req.session.user){
                return res.status(200).json({
                    message: "You are already logged in",
                    user: req.session.user
                })
            }
            const { username, password } = req.body;

            const user = await User.findOne({
                where: {
                    [Op.or]:[
                        { username: username},
                    ]
                }
            });

            if (!user){
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const passwordValid = bcryptjs.compareSync(password, user.password);

            if (!passwordValid){
                return res.status(401).json({ auth: false,  message: 'Invalid Password'});
            }

            const accesToken = jwt.sign({ id: user.id}, config.jwtKey, {
                expiresIn: 3600
            });

            const refreshToken = jwt.sign({ id: user.id }, config.jwtRefresh, {});

            RefreshToken.create({
                token: refreshToken,
                user_id: user.id,
                token: accesToken,
                refreshToken: refreshToken
            });

            req.session.user = {
                id: user.id,
                username: user.username,
                token: accesToken,
                refreshToken: refreshToken
            }
            
            return res.status(200).json({
                message: "User found",
                user: req.session.user,
            });

            } catch (error) {
            return res.status(500).json({ message: error.message || "Internal Server Error" });
            }
    },

    async generateAccessToken(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                await transaction.rollback();
                return res.status(400).json({ message: "Refresh token is required" });
            }

            const decoded = jwt.verify(refreshToken, config.jwtRefresh);
            const existingToken = await RefreshToken.findOne({
                where: {
                    token: refreshToken,
                    user_id: decoded.id
                }
            });

            if (!existingToken) {
                await transaction.rollback();
                return res.status(401).json({ message: "Invalid refresh token" });
            }

            const accessToken = jwt.sign({ id: decoded.id }, config.jwtKey, {
                expiresIn: 60 * 60 * 1
            });

            await transaction.commit();
            return res.status(200).json({
                message: "Token refreshed",
                token: accessToken
            });
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    },


    async signOut(req, res) {
        try {

            const token = req.headers['authorization']?.split(' ')[1];

            if (!token) {
                return res.status(400).json({ message: "Token is required" });
            }

            let decode;
            try {
                decode = jwt.verify(token, config.jwtKey);
            } catch (error) {
                return res.status(401).json({ message: "Invalid token" });
            }

            const userId = decode.id;

            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ message: err.message || "Internal Server Error" });
                }
            });

            res.clearCookie('connect.sid');

            await RefreshToken.destroy({
                where: {
                    user_id: userId
                }
            });


            return res.status(200).json({
                auth: false,
                token: null,
                message: "User logged out"
            });
        } catch (error) {
            return res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    },

    async updatePassword(req, res) {
        const transaction = await sequelize.transaction();

        try {
            const userId = req.session?.user?.id;
            if (!userId) {
                await transaction.rollback();
                return res.status(401).json({
                    message: "Unauthorized"
                });
            }

            const user = await User.findByPk(userId);

            if (!user) {
                await transaction.rollback();
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const { password, newPassword } = req.body;

            const passwordIsValid = bcryptjs.compareSync(password, user.password);

            if (!passwordIsValid) {
                await transaction.rollback();
                return res.status(402).json({ message: 'Current password is incorrect' });
            }

            const hashedPassword = bcryptjs.hashSync(newPassword, 8);

            await user.update({
                password: hashedPassword
            }, { transaction });

            await transaction.commit();

            return res.status(200).json({
                message: "Password updated"
            });
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    },
}