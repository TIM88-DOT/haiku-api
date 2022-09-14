import { Request, Response } from "express";
import { HttpResponse } from "../domain/response";
import { RowDataPacket, OkPacket, ResultSetHeader, FieldPacket } from "mysql2";

import logger from "../config/logger.config";

import { Code } from "../enums/code.enum";
import { Status } from "../enums/status.enum";

import { Credentials } from "../interfaces/credentials.interface";

import { GenerateToken } from "../provider/generateToken.provider";
import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const login = async function (req: Request, res: Response) {
    try {
        const { email, password } = req.body as unknown as Credentials;
        if (!email || !password) {
            return res.status(401).json({ message: "Missing parameters" });
        }
        console.log(email, password);
        
        const admin = await prisma.admins.findUnique({
            where: {
                email: email,
            },
        })
        if (admin) {
            const isValid = await bcrypt.compare(password, admin.password);
            if (!isValid) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            const generateToken = new GenerateToken();
            const token = await generateToken.execute(admin.adminId);
            res.status(200).json({
                status: "OK",
                data: { AccessToken: token },
            });
        }

    } catch (error) {
        logger.info(`Error : ${error}`);
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, 'An error has occured'));
    }
};

