import { Request, Response } from "express";
import dotenv from 'dotenv';
import { Secret, verify } from "jsonwebtoken";
import logger from "../config/logger.config";
import { PrismaClient } from "@prisma/client";

export const ensureAuthenticated = async (req :Request, res: Response, next :any) => {
    dotenv.config();
    const prisma = new PrismaClient();
    // Get the token from the Authorization header
    const authToken = req.headers.authorization;

    // Return code 401 if no token is provided
    if (!authToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Slit the token to remove the "Bearer " part
    const token = authToken.split(" ")[1];

     // Verify the token and check if the admin is valid. Any error will return code 401
  try {
    // the admin const contains an object with the userId
    const adminObj = verify(token, process.env.JWT_SECRET as Secret) as any;
    console.log(adminObj)
    const admin = await prisma.admins.findUnique({
      where: {
        adminId: adminObj.adminId,
      },
  })

    next();
    if (!admin) {
      return res.status(401).json({ message: "This Token is Invalid" });
    }
  } catch (error) {
    logger.info(`Error : ${error}`);
    return res.status(500).json({ message: "something wrong" });
  }
}