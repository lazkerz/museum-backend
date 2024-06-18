import { sequelize } from "../../../db/index.js";
import User from "../../models/user.models.js";
import Budaya from "../../models/budaya.models.js";
import Makanan from "../../models/makanan.model.js";
import Resep from "../../models/resep.model.js";


export const UserController = {

    //feature budaya
    async getAllBudaya(req, res) {
        try {
            const budayas = await Budaya.findAll();
            return res.status(200).json({
                message: "Success get all budaya",
                data: budayas
            });
        } catch (error) {
            return res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    },

    async detailBudaya(req, res) {
        try {    
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
    
            return res.status(200).json({
                message: "Budaya updated successfully",
                data: budaya
            });
    
        } catch (error) {
            return res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    },

    //end feature budaya
    async getAllMakanan(req, res) {
        try {
            const makanan = await Makanan.findAll({
                include : [
                    {
                        model: Resep,
                        as: 'resep',
                    }

                ]
            });

            if (!makanan){
                return res.status(404).json({
                    message: "Makanan not found"
                })
            }

            return res.status(200).json({
                message: "Success get all budaya",
                data: makanan
            });


        } catch (error) {
            return res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    },

    async detailMakanan(req, res) {
        try {
            const makanan_id = req.params.id;
    
            if (!makanan_id) {
                return res.status(400).json({
                    message: "Makanan id is required"
                });
            }
     
            const makanan = await Makanan.findByPk(makanan_id, {
                include: [{ model: Resep, as: 'resep' }]
            });
    
            if (!makanan) {
                return res.status(404).json({
                    message: "Budaya not found"
                });
            }

            return res.status(200).json({
                message: "Budaya updated successfully",
                data: makanan,
            });
    
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    }
    //feature makanan daerah

}