import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    getUsers
} from "../services/userService";


export async function getUsersController(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const users = await getUsers();

        return res.status(200).json(users);

    } catch (error) {

        next(error);
    }
}