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

export const getToken = async (req: Request, res: Response): Promise<Response<Token[]>> => {
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