import {
    Response,
    NextFunction
} from "express";

import {
    AuthenticatedRequest
} from "../middleware/authMiddleware";

import {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    assignTask
} from "../services/taskService";


function getTaskId(
    req: AuthenticatedRequest
): number {
    return Number(req.params.id);
}


/* -------------------------
   Get All / User Tasks
------------------------- */

export async function getTasksController(
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

        const tasks = await getTasks(
            req.user.userId,
            req.user.role
        );

        return res.status(200).json(tasks);

    } catch (error) {

        next(error);
    }
}


/* -------------------------
   Get Single Task
------------------------- */

export async function getTaskController(
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

        const task = await getTask(
            getTaskId(req),
            req.user.userId,
            req.user.role
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json(task);

    } catch (error) {

        next(error);
    }
}


/* -------------------------
   Create Task
------------------------- */

export async function createTaskController(
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

        const task = await createTask(
            req.body,
            req.user.role
        );

        return res.status(201).json(task);

    } catch (error) {

        next(error);
    }
}


/* -------------------------
   Update Task
------------------------- */

export async function updateTaskController(
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

        const task = await updateTask(
            getTaskId(req),
            req.body,
            req.user.userId,
            req.user.role
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json(task);

    } catch (error) {

        next(error);
    }
}


/* -------------------------
   Delete Task
------------------------- */

export async function deleteTaskController(
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

        const deleted = await deleteTask(
            getTaskId(req),
            req.user.role
        );

        if (!deleted) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {

        next(error);
    }
}


/* -------------------------
   Assign Task
------------------------- */

export async function assignTaskController(
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

        const task = await assignTask(
            getTaskId(req),
            req.body.userId,
            req.user.role
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json(task);

    } catch (error) {

        next(error);
    }
}