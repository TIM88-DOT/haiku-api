import { Router } from "express";
import { createToken, deleteToken, getTokenByAddress, getTokens, updateToken } from "../controllers/token.controller";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.middleware";
export const tokenRoute = Router();

tokenRoute.route('/')
    .get(getTokens)
    .post(ensureAuthenticated, createToken);

tokenRoute.route('/:address')
    .get(getTokenByAddress)
    .put(ensureAuthenticated, updateToken)
    .delete(ensureAuthenticated, deleteToken)