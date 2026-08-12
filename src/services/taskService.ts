import { Task } from "../types/task"

export async function getTasks():Promise<Task[]>{
    const response = await fetch("http://localhost:3001/tasks");
    if (!response){
        throw new Error("Failed to fetch tasks");
    }
    const tasks : Task[] = await response.json();
    return tasks;
}