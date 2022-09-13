import { Request, Response } from "express";
import { HttpResponse } from "../domain/response";
import { RowDataPacket, OkPacket, ResultSetHeader, FieldPacket } from "mysql2";
import { ADMIN_QUERY } from "../queries/admin.query";

import { connection } from "../config/mysql.config";
import logger from "../config/logger.config";

import { Code } from "../enums/code.enum";
import { Status } from "../enums/status.enum";

import { Credentials } from "../interfaces/credentials.interface";
import { Admin } from "../interfaces/admin.interface";

import { GenerateToken } from "../provider/generateToken.provider";
import bcrypt from 'bcrypt';


type ResultSet = [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]];


export const login = async function (req: Request, res: Response) {
    try {
        const { email, password } = req.body as unknown as Credentials;
        if (!email || !password) {
            return res.status(401).json({ message: "Missing parameters" });
        }
        const pool = await connection();
        const result: ResultSet = await pool.query(ADMIN_QUERY.SELECT_ADMIN_BY_EMAIL, email);
        let adminList = result[0] as unknown as Array<Admin>;
        let admin = adminList.shift() as Admin;
        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid || !admin) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const generateToken = new GenerateToken();
        const token = await generateToken.execute(admin.adminId);
        res.status(200).json({
            status: "OK",
            data: { AccessToken: token },
        });

    } catch (error) {
        logger.info(`Error : ${error}`);
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error has occured'));
    }
};

