import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { JwtPayload } from "../types/auth";


const JWT_SECRET =
    process.env.JWT_SECRET || "my-secret-key";


export interface AuthenticatedRequest
    extends Request {
    user?: JwtPayload;
}


export function authMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {

    const authHeader =
        req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authentication token is required"
        });
    }

    const parts =
        authHeader.split(" ");

    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer"
    ) {
        return res.status(401).json({
            message: "Invalid authorization format"
        });
    }

    const token = parts[1];

    try {

        const decoded =
            jwt.verify(
                token,
                JWT_SECRET
            ) as JwtPayload;

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}


export function adminMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {

    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required"
        });
    }

    next();
}