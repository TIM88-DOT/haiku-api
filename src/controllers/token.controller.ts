import { Request, Response } from "express";
import logger from "../config/logger.config";
import { HttpResponse } from "../domain/response";
import { Code } from "../enums/code.enum";
import { Status } from "../enums/status.enum";
import { Token } from "../interfaces/token.interface";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const getTokens = async (req: Request, res: Response): Promise<Response<HttpResponse>> => {
    logger.info(`Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
    try {
        const allTokens = await prisma.tokens.findMany();
        return res.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, 'All tokens retrieved', allTokens));
    } catch (error: unknown) {
        logger.info(`Error : ${error}`);
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error has occured'));
    }
}

export const getTokenByAddress = async (req: Request, res: Response): Promise<Response<HttpResponse>> => {
    logger.info(`Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
    try {
        const token = await prisma.tokens.findUnique({
            where: {
                address: req.params.address,
            },
        })
        if (token) {
            return res.status(Code.OK)
                .send(new HttpResponse(Code.OK, Status.OK, 'Token retrieved', token));
        } else {
            return res.status(Code.NOT_FOUND)
                .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Token not found'));
        }
    } catch (error: unknown) {
        logger.info(`Error : ${error}`);
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error has occured'));
    }
}

export const createToken = async (req: Request, res: Response): Promise<Response<HttpResponse>> => {
    logger.info(`Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
    let requestToken: Token = { ...req.body };
    try {
        const newtoken = await prisma.tokens.create({
            data: {
                name: requestToken.name,
                symbol: requestToken.symbol,
                address: requestToken.address,
                chainId: requestToken.chainId,
                voteCount: requestToken.voteCount
            },
        });
        return res.status(Code.CREATED)
            .send(new HttpResponse(Code.CREATED, Status.CREATED, 'New token created', newtoken));
    } catch (error: unknown) {
        logger.info(`Error : ${error}`);
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error has occured'));
    }
}

export const updateToken = async (req: Request, res: Response): Promise<Response<HttpResponse>> => {
    logger.info(`Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
    let token: Token = { ...req.body };

    const tokenExists = await prisma.tokens.findUnique({ where: { address: token.address } });
    if (!tokenExists) {
        return res.status(Code.NOT_FOUND)
            .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Token not found'));
    }

    try {
        const updateToken = await prisma.tokens.update({
            where: {
                address: token.address,
            },
            data: {
                name: token.name,
                symbol: token.symbol,
                address: token.address,
                chainId: token.chainId,
                voteCount: token.voteCount
            },
        })
        return res.status(Code.OK)
            .send(new HttpResponse(Code.OK, Status.OK, 'Token updated', updateToken));
    }
    catch (error: unknown) {
        logger.info(`Error : ${error}`);
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error has occured'));
    }
}

export const deleteToken = async (req: Request, res: Response): Promise<Response<HttpResponse>> => {
    logger.info(`Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);

    const tokenExists = await prisma.tokens.findUnique({ where: { address: req.params.address } });
    if (!tokenExists) {
        return res.status(Code.NOT_FOUND)
            .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Token not found'));
    }

    try {
        await prisma.tokens.delete({
            where: {
                address: req.params.address,
            },
        })
        return res.status(Code.OK)
            .send(new HttpResponse(Code.OK, Status.OK, `Token deleted`));
    }
    catch (error: unknown) {
        logger.info(`Error : ${error}`);
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error has occured'));
    }
}