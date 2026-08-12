import {Request , Response} from "express"

import {
    getTasks,
    getTask,
    createTask,
    updateTask
} from "../services/taskService";

import { CreateTasks, UpdateTask } from "../types/task";

export async function getTasksController(
    req: Request,
    res: Response
) {
    try {
        const tasks = await getTasks();

        res.json(tasks);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
}

export async function createTasksController(req: Request<{}, {}, CreateTasks>, res:Response) {
    try{
        const taskData = req.body;
        const task = await createTask(taskData);
        res.status(201).json(task);
    }catch(error){
        res.status(500).json({
            message: "Failed to create task"
        });
    }
}

export async function getTaskController(
    req: Request,
    res: Response
) {
    try {
        // Normalize params.id which can be string | string[] in some request typings
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;

        if (!id) {
            return res.status(400).json({ message: "Task id is required" });
        }

        const task = await getTask(id);

        res.json(task);
    } catch (error) {
        console.error("GET TASK ERROR:", error);
        res.status(500).json({
            message: "Failed to fetch task"
        });
    }
}

export async function updateTaskController(
    req: Request<{ id: string }, {}, UpdateTask>,
    res: Response
) {
    try {
        const id = req.params.id;
        const taskData = req.body;

        const task = await updateTask(id, taskData);

        res.json(task);
    } catch (error) {
        console.error("UPDATE TASK ERROR:", error);

        res.status(500).json({
            message: "Failed to update task"
        });
    }
}