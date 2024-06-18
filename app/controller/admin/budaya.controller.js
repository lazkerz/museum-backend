import { sequelize } from "../../../db/index.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import User from "../../models/user.models.js";
import Budaya from "../../models/budaya.models.js";

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
                const files = req.files;
                media = files.map(file => {
                    const filename = path.basename(file.path);
                    return `${req.protocol}://${req.get("host")}/media/${filename}`;
                });
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
    }
    
}