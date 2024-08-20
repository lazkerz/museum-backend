import { sequelize } from "../../../db/index.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import User from "../../models/user.models.js";
import Budaya from "../../models/budaya.models.js";
import { imageUploader } from "../../utils/imagekit.js";

export const BudayaController = {

    async createBudaya(req, res) {
        const transaction = await sequelize.transaction();
        try {     
            const admin = await User.findByPk(req.userId);

            if (!admin) {
                return res.status(403).json({
                    message: "Require admin role"
                });
            }

            const { nama_budaya, deskripsi, kategori_id, lokasi } = req.body;

            let media = [];

            if (req.files) {
                try {
                    const files = req.files;
                    for (const file of files) {
                        const imageUrl = await imageUploader.uploadImagekit(file);
                        media.push(imageUrl);
                    }
                } catch (error) {
                    logger.error("Error uploading image:", error);
                    throw new Error('Error uploading image');
                }
            } else {
                throw new Error('No image provided');
            }

            const new_budaya = await Budaya.create({
                nama_budaya,
                deskripsi,
                kategori_id,
                media,
                lokasi
            }, { transaction });

            await transaction.commit();

            return res.status(201).json({
                message: "Budaya created successfully",
                data: new_budaya
            });

        } catch (error) {

            await transaction.rollback();
            
            if (req.files) {
                req.files.forEach((file) => {
                    fs.unlinkSync(file.path);
                });
            }
            return res.status(500).json({ message: error.message || "Internal Server Error" });

        }
    },

    async getAllBudaya(req, res) {
        try {
            const admin = await User.findByPk(req.userId);

            if (!admin) {
                return res.status(403).json({
                    message: "Require admin role"
                });
            }

            const budayas = await Budaya.findAll();
            return res.status(200).json({
                message: "Success get all budaya",
                data: budayas
            });
        } catch (error) {
            return res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    },

    async getBudayabyCategory(req, res) {
        try {

            const admin = await User.findByPk(req.userId);

            if (!admin) {
                return res.status(403).json({
                    message: "Require admin role"
                });
            }
            
            const category = req.params.kategori;
    
            if (!category) {
                return res.status(400).json({
                    message: "Category is required"
                });
            }
    
            const budayas = await Budaya.findAll({
                where: {
                    kategori_id: category
                }
            });
    
            if (budayas.length === 0) {
                return res.status(404).json({
                    message: "No Budaya found for this category"
                });
            }
    
            return res.status(200).json({
                message: "Get Budaya by category successfully",
                data: budayas
            });
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
    },    

    async updateBudaya(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const admin = await User.findByPk(req.userId);
    
            if (!admin) {
                return res.status(403).json({
                    message: "Require admin role"
                });
            }
    
            const budaya_id = req.params.id;
    
            if (!budaya_id) {
                return res.status(400).json({
                    message: "Budaya id is required"
                });
            }
    
            const budaya = await Budaya.findByPk(budaya_id);
    
            if (!budaya) {
                return res.status(404).json({
                    message: "Budaya not found"
                });
            }
    
            // Logging the received data
            // console.log('Received data for update:', req.body);
    
            // Update only the provided fields
            Object.assign(budaya, req.body);
    
            await budaya.save({ transaction });
    
            await transaction.commit();
            return res.status(200).json({
                message: "Budaya updated successfully",
                data: budaya
            });
    
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    },

    async deleteBudaya(req, res){
        const transaction = await sequelize.transaction();
        try {
            const admin = await User.findByPk(req.userId);
    
            if (!admin) {
                return res.status(403).json({
                    message: "Require admin role"
                });
            }
    
            const budaya_id = req.params.id;
    
            if (!budaya_id) {
                return res.status(400).json({
                    message: "Budaya id is required"
                });
            }
    
            const budaya = await Budaya.findByPk(budaya_id);
    
            if (!budaya) {
                return res.status(404).json({
                    message: "Budaya not found"
                });
            }
    
            // Logging the received data
            // console.log('Received data for update:', req.body);
    
            // Update only the provided fields
            Object.assign(budaya, req.body);
    
            await budaya.destroy({ transaction });
    
            await transaction.commit();
            return res.status(200).json({
                message: "Budaya deleted successfully",
            });
    
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    }
    
}