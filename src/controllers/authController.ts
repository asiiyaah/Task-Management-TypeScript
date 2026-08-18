import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    AuthenticatedRequest
} from "../middleware/authMiddleware";

import * as authService
    from "../services/authServices";

import {
    RegisterInput,
    LoginInput
} from "../../shared/schemas/auth.schema";


export async function registerController(
    req: Request<{}, {}, RegisterInput>,
    res: Response,
    next: NextFunction
) {

    try {

        const user =
            await authService.register(
                req.body
            );

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {

        next(error);
    }
}


export async function loginController(
    req: Request<{}, {}, LoginInput>,
    res: Response,
    next: NextFunction
) {

    try {

        const result = await authService.login(req.body);

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000,
        });

        res.status(200).json({
            user: result.user,
        });

    } catch (error) {

        next(error);
    }
}

export async function getCurrentUserController(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {

    try {

        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const user =
            await authService.getCurrentUser(
                req.user.userId
            );

        res.status(200).json({
            user
        });

    } catch (error) {

        next(error);
    }
}

export function logoutController(
    req: Request,
    res: Response
) {

    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    res.status(200).json({
        message: "Logged out successfully"
    });
}