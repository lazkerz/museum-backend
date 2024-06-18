import { sequelize } from "../../db/index.js";
import Kategori from "../models/kategori.models.js";

export const CategoryController = {

    async createKategori(req, res) {
        const transaction = await sequelize.transaction();
        try {      
            const { kategori } = req.body;
            const kategoriExists = await Kategori.findOne({
                where: {
                    kategori: kategori}
            });
            if (kategoriExists) {
                return res.status(409).json({
                    message: "Kategori already exists"});
            } else {
                const Category = await Kategori.create({
                    kategori,
                }, { transaction });
                await transaction.commit();
                return res.status(201).json({
                    message: "Kategori created",
                    Category
                });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    },
}