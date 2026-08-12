import {
    Request,
    Response,
    NextFunction
} from "express";


export function validateCreateTask(
    req: Request,
    res: Response,
    next: NextFunction
) {

    const { title } = req.body;

    if (
        !title ||
        typeof title !== "string" ||
        title.trim() === ""
    ) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    next();
}


export function validateUpdateTask(
    req: Request,
    res: Response,
    next: NextFunction
) {

    const {
        title,
        description,
        completed
    } = req.body;

    if (
        title === undefined &&
        description === undefined &&
        completed === undefined
    ) {
        return res.status(400).json({
            message: "At least one field is required"
        });
    }

    if (
        title !== undefined &&
        (
            typeof title !== "string" ||
            title.trim() === ""
        )
    ) {
        return res.status(400).json({
            message: "Title must be a non-empty string"
        });
    }

    if (
        completed !== undefined &&
        typeof completed !== "boolean"
    ) {
        return res.status(400).json({
            message: "Completed must be a boolean"
        });
    }

    next();
}


export function validateAssignment(
    req: Request,
    res: Response,
    next: NextFunction
) {

    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({
            message: "userId is required"
        });
    }

    next();
}