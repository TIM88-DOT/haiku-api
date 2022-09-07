import { Router } from "express";
import { createToken, deleteToken, getTokenByAddress, getTokens, updateToken } from "../controllers/token.controller";

export const tokenRoute = Router();

tokenRoute.route('/')
    .get(getTokens)
    .post(createToken);

tokenRoute.route('/:tokenAddress')
    .get(getTokenByAddress)
    .put(updateToken)
    .delete(deleteToken)