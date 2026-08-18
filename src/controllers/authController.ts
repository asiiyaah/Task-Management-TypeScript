import {
    Request,
    Response,
    NextFunction
} from "express";

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

        const result =
            await authService.login(
                req.body
            );

        res.status(200).json(result);

    } catch (error) {

        next(error);
    }
}