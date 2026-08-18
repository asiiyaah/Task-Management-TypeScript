import {
    Request,
    Response,
    NextFunction
} from "express";

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
    const token = (req as any).cookies?.token as string | undefined;

    if (!token) {
        return res.status(401).json({
            message: "Authentication token is required"
        });
    }

    try {
        const decoded =
            jwt.verify(
                token,
                JWT_SECRET
            ) as JwtPayload;

        req.user = decoded;

        next();

    } catch {
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