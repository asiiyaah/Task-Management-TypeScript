import {
    Request,
    Response,
    NextFunction
} from "express";

export function errorMiddleware(
    error: Error & {
        statusCode?: number;
        type?: string;
    },
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(
        "ERROR:",
        error.message
    );

    if (res.headersSent) {
        return next(error);
    }

    // Malformed JSON body
    if (error instanceof SyntaxError && error.statusCode === 400) {
        return res.status(400).json({
            message: "Invalid JSON"
        });
    }

    const statusCode =
        error.statusCode || 500;

    res.status(statusCode).json({
        message:
            error.message ||
            "Internal server error"
    });
}