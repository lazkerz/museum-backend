import { Router } from 'express';
import multipleUploads from '../utils/multer.js';
import { AuthMiddleware } from '../middleware/auth.js';
import { BudayaController } from '../controller/admin/budaya.controller.js';
import { MakananController } from '../controller/admin/makanan.controller.js';


const adminrouter = Router();

//budaya
adminrouter.post("/add-budaya", multipleUploads, AuthMiddleware.verifyToken, AuthMiddleware.isAdmin, BudayaController.createBudaya);
adminrouter.get("/budaya", AuthMiddleware.verifyToken, AuthMiddleware.isAdmin, BudayaController.getAllBudaya);
adminrouter.put("/update-budaya/:id", AuthMiddleware.verifyToken, AuthMiddleware.isAdmin, BudayaController.updateBudaya);
adminrouter.get("/budaya-category", AuthMiddleware.verifyToken, AuthMiddleware.isAdmin, BudayaController.getBudayabyCategory);
adminrouter.delete("/delete-budaya/:id", AuthMiddleware.verifyToken, AuthMiddleware.isAdmin, BudayaController.deleteBudaya);
//end budaya

//makanan daerah
adminrouter.post("/add-makanan", multipleUploads, AuthMiddleware.verifyToken, AuthMiddleware.isAdmin, MakananController.createMakanan);
adminrouter.get("/makanan", AuthMiddleware.verifyToken, AuthMiddleware.isAdmin, MakananController.getAllMakanan);
adminrouter.put("/update-makanan/:id", AuthMiddleware.verifyToken, AuthMiddleware.isAdmin, MakananController.updateMakanan);
adminrouter.delete("/delete-makanan/:id", AuthMiddleware.verifyToken, AuthMiddleware.isAdmin, MakananController.deleteMakanan);

export default adminrouter