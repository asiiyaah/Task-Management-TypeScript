import {Request , Response} from "express"

import { getTasks,createTask } from "../services/taskService"  
import { CreateTasks } from "../types/task";

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