import { Router } from "express";
import { AuthController } from "../controller/auth/AuthController.js";
import { AuthMiddleware } from "../middleware/auth.js";

const authRouter = Router();

authRouter.post("/daftar-admin", AuthController.signUp);
authRouter.post("/login-admin", AuthController.signIn);
authRouter.post("/generate-new-token", AuthController.generateAccessToken);
authRouter.post("/logout", AuthMiddleware.verifyToken, AuthController.signOut);
authRouter.put("/update-password", AuthMiddleware.verifyToken, AuthController.updatePassword);

export default authRouter;