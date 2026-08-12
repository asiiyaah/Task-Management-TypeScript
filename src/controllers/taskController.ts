import {Request , Response} from "express"

import { getTasks } from "../services/taskService"  

export async function getTasksController(req:Request , res : Response){
    
    try{
        const tasks = await getTasks();
        res.json(tasks)
    }
    catch(error){
        res.status(500).json({
            message:"Failed to fetch tasks"
        });
    }
}