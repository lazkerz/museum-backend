import router from './router.js';
import authRouter from './auth.routes.js';
import adminrouter from './admin.routes.js';
import { CategoryController } from '../controller/category.controller.js';
import { UserController } from '../controller/user/user.controller.js';


router.use('/auth', authRouter);
router.use('/admin', adminrouter);

//user
router.use('/addcategory', CategoryController.createKategori);
router.use('/budaya', UserController.getAllBudaya);
router.use('/detail-budaya/:id', UserController.detailBudaya);
router.use('/makanan', UserController.getAllMakanan);
router.use('/detail-makanan/:id', UserController.detailMakanan);
router.use('/budaya-category', UserController.getBudayabyCategory);

export const routes = router;
