import {Router} from "express";
import * as authController from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/register", authController.Register);
authRouter.post("/login", authController.Login);

export default authRouter;