import { sequelize } from "../../../db/index.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import User from "../../models/user.models.js";
import Resep from "../../models/resep.model.js";
import Makanan from "../../models/makanan.model.js"
import { imageUploader } from "../../utils/imagekit.js";

export const MakananController = {

    async createMakanan(req, res) {
        const transaction = await sequelize.transaction();
        try {     
            const admin = await User.findByPk(req.userId);

            if (!admin) {
                return res.status(403).json({
                    message: "Require admin role"
                });
            }

            const { nama_makanan, deskripsi, kategori_id, lokasi, bahan, cara_memasak, penyajian, keunikan } = req.body;

            const resep = await Resep.create({
                bahan,
                cara_memasak,
                penyajian,
                keunikan
            }, {transaction});

            
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
            
            const makanan = await Makanan.create({
                nama_makanan,
                deskripsi,
                resep_id: resep.id,
                kategori_id: 5,
                media,
                lokasi,
            }, {transaction});
            await transaction.commit();
            return res.status(201).json({
                message: "Budaya created successfully",
                makanan,
                resep
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

    async getAllMakanan(req, res) {
        try {
            const admin = await User.findByPk(req.userId);

            if (!admin) {
                return res.status(403).json({
                    message: "Require admin role"
                });
            }

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

    async updateMakanan(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const admin = await User.findByPk(req.userId);
    
            if (!admin) {
                return res.status(403).json({
                    message: "Require admin role"
                });
            }
    
            const makanan_id = req.params.id;
    
            if (!makanan_id) {
                return res.status(400).json({
                    message: "Makanan id is required"
                });
            }
    
            const makanan = await Makanan.findByPk(makanan_id);
    
            if (!makanan) {
                return res.status(404).json({
                    message: "Budaya not found"
                });
            }
    
            // Logging the received data
            // console.log('Received data for update:', req.body);
    
            // Update only the provided fields
            Object.assign(makanan, req.body);
    
            await makanan.save({ transaction });

            if (makanan.resep_id) {
                const resep = await Resep.findByPk(makanan.resep_id);
                if (resep) {
                    const resepUpdateData = {
                        bahan: req.body.bahan,
                        cara_memasak: req.body.cara_memasak,
                        penyajian: req.body.penyajian,
                        keunikan: req.body.keunikan
                    };
                    Object.assign(resep, resepUpdateData);
                    await resep.save({ transaction });
                }
            }

            const updatedMakanan = await Makanan.findByPk(makanan_id, {
                include: [{ model: Resep, as: 'resep' }]
            });
            
            
            await transaction.commit();
            return res.status(200).json({
                message: "Budaya updated successfully",
                data: updatedMakanan,
            });
    
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    }
    
}