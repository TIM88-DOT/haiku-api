import { Router } from "express";
import { login } from "../controllers/auth.controller";

export const authRoute = Router();

authRoute.route("/")
    .post(login);
