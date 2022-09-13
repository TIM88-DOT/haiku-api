
import jwt from "jsonwebtoken";

export class GenerateToken {
    async execute(adminId: string) {
        const token = jwt.sign(
            { adminId: adminId },
            `${process.env.JWT_SECRET}`,
        );
        return token;
    }
}

