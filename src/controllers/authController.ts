import {
    Request,
    Response,
    NextFunction
} from "express";

import * as authService
    from "../services/authServices";

import * as userRepository from "../repositories/userRepository";

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

        const result =
            await authService.login(
                req.body
            );

        // Set the JWT in an HTTP-only cookie named "token"
        res.cookie("token", result.token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // Return only the user object to the client
        res.status(200).json({ user: result.user });

    } catch (error) {

        next(error);
    }
}


export async function getCurrentUserController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authReq = req as any;

        const userId = authReq.user?.userId as number | undefined;

        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const user = await userRepository.getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { password, ...safeUser } = user as any;

        res.status(200).json({ user: safeUser });

    } catch (error) {
        next(error);
    }
}


export async function logoutController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
}