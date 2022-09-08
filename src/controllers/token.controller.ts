import { Request, Response } from "express";
import { RowDataPacket, OkPacket, ResultSetHeader, FieldPacket } from "mysql2";
import logger from "../config/logger.config";
import { connection } from "../config/mysql.config";
import { HttpResponse } from "../domain/response";
import { Code } from "../enums/code.enum";
import { Status } from "../enums/status.enum";
import { Token } from "../interfaces/token.interface";
import { QUERY } from "../queries/token.query";

type ResultSet = [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]];

export const getTokens = async (req: Request, res: Response): Promise<Response<Token[]>> => {
    logger.info(`Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
    try {
        const pool = await connection();
        const result: ResultSet = await pool.query(QUERY.SELECT_TOKENS);
        return res.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, 'All tokens retrieved', result[0]));
    } catch (error: unknown) {
        logger.info(`Error : ${error}`);
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error has occured'));
    }
}

export const getTokenByAddress = async (req: Request, res: Response): Promise<Response<Token>> => {
    logger.info(`Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
    try {
        const pool = await connection();
        const result: ResultSet = await pool.query(QUERY.SELECT_TOKEN_BY_ADDRESS, [req.params.address]);
        if ((result[0] as Array<ResultSet>).length > 0) {
            return res.status(Code.OK)
                .send(new HttpResponse(Code.OK, Status.OK, 'Token retrieved', result[0]));
        } else {
            return res.status(Code.NOT_FOUND)
                .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Token not found'));
        }
    } catch (error: unknown) {
        logger.info(`Error : ${error}`);
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error has occured'));
    }
}


export const createToken = async (req: Request, res: Response): Promise<Response<Token>> => {
    logger.info(`Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
    let token: Token = { ...req.body };
    try {
        const pool = await connection();
        const result: ResultSet = await pool.query(QUERY.CREATE_TOKEN, Object.values(token));
        token = { id: (result[0] as ResultSetHeader).insertId, ...req.body }
        return res.status(Code.CREATED)
            .send(new HttpResponse(Code.CREATED, Status.CREATED, 'New token created', token));
    } catch (error: unknown) {
        logger.info(`Error : ${error}`);
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error has occured'));
    }
}

export const updateToken = async (req: Request, res: Response): Promise<Response<Token>> => {
    logger.info(`Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
    let token: Token = { ...req.body };
    try {
        const pool = await connection();
        const result: ResultSet = await pool.query(QUERY.SELECT_TOKEN_BY_ADDRESS, [req.params.tokenAddress]);
        if ((result[0] as Array<ResultSet>).length > 0) {
            const result: ResultSet = await pool.query(QUERY.UPDATE_TOKEN, [...Object.values(token),req.params.tokenAddress]);
            return res.status(Code.OK)
                .send(new HttpResponse(Code.OK, Status.OK, 'Token updated',{...token} ));
        } else {
            return res.status(Code.NOT_FOUND)
                .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Token not found'));
        }
    } catch (error: unknown) {
        logger.info(`Error : ${error}`);
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error has occured'));
    }
}


export const deleteToken = async (req: Request, res: Response): Promise<Response<Token>> => {
    logger.info(`Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
    try {
        const pool = await connection();
        const result: ResultSet = await pool.query(QUERY.SELECT_TOKEN_BY_ADDRESS, [req.params.tokenAddress]);
        if ((result[0] as Array<ResultSet>).length > 0) {
            const result: ResultSet = await pool.query(QUERY.DELETE_TOKEN, [req.params.tokenAddress]);
            return res.status(Code.OK)
                .send(new HttpResponse(Code.OK, Status.OK, `Token ${req.params.id} deleted`));
        } else {
            return res.status(Code.NOT_FOUND)
                .send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, 'Token not found'));
        }
    } catch (error: unknown) {
        logger.info(`Error : ${error}`);
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error has occured'));
    }
}