import {
    Request,
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

import {
    CreateTasks,
    UpdateTask
} from "../types/task";


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

        res.status(200).json(tasks);

    } catch (error) {

        next(error);
    }
}


export async function createTasksController(
    req: Request<{}, {}, CreateTasks>,
    res: Response,
    next: NextFunction
) {

    try {

        const task =
            await createTask(req.body);

        res.status(201).json(task);

    } catch (error) {

        next(error);
    }
}


export async function getTaskController(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) {

    try {

        const id = req.params.id;

        if (!id) {
            return res.status(400).json({
                message: "Task id is required"
            });
        }

        const task =
            await getTask(id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(task);

    } catch (error) {

        next(error);
    }
}


export async function updateTaskController(
    req: Request<
        { id: string },
        {},
        UpdateTask
    >,
    res: Response,
    next: NextFunction
) {

    try {

        const id = req.params.id;

        const task =
            await updateTask(
                id,
                req.body
            );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(task);

    } catch (error) {

        next(error);
    }
}


export async function deleteTaskController(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
){

    try {

        const id = req.params.id;

        const deleted =
            await deleteTask(id);

        if (!deleted) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(204).send();

    } catch (error) {

        next(error);
    }
}


export async function assignTaskController(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) {

    try {

        const taskId = req.params.id;
        const { userId } = req.body;

        const task =
            await assignTask(
                taskId,
                userId
            );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(task);

    } catch (error) {

        next(error);
    }
}