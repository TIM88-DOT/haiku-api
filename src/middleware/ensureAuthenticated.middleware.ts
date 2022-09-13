import { Request, Response } from "express";
import dotenv from 'dotenv';
import { Secret, verify } from "jsonwebtoken";
import { connection } from "../config/mysql.config";
import { Admin } from "../interfaces/admin.interface";
import { ADMIN_QUERY } from "../queries/admin.query";
import { RowDataPacket, OkPacket, ResultSetHeader, FieldPacket } from "mysql2";

export const ensureAuthenticated = async (req :Request, res: Response, next :any) => {
    dotenv.config();
    type ResultSet = [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]];
    // Get the token from the Authorization header
    const authToken = req.headers.authorization;

    // Return code 401 if no token is provided
    if (!authToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Slit the token to remove the "Bearer " part
    const token = authToken.split(" ")[1];

     // Verify the token and check if the user exists. Any error will return code 401
  try {
    // the user const contains a object with the userId
    const admin = verify(token, process.env.JWT_SECRET as Secret) as any;
    
    const pool = await connection();
    const result: ResultSet = await pool.query(ADMIN_QUERY.SELECT_ADMIN_BY_ADMINID, admin.adminId);
    console.log(admin)
    let adminList = result[0] as unknown as Array<Admin>;
    let isAdminValid = adminList.shift() as Admin;
    next();
    if (!isAdminValid) {
      return res.status(401).json({ message: "This Token is Invalid" });
    }
  } catch (error) {
    return res.status(401).json({ message: "This Token is Invalid" });
  }
}