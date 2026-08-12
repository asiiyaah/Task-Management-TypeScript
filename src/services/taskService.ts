import { CreateTasks, Task, UpdateTask } from "../types/task";

export async function getTasks(): Promise<Task[]> {
    const response = await fetch("http://localhost:3001/tasks");
    if (!response.ok) {
        throw new Error("Failed to fetch tasks");
    }
    const tasks: Task[] = await response.json();
    return tasks;
}

export async function createTask(taskData: CreateTasks): Promise<Task> {
    const response = await fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: taskData.title,
            description: taskData.description,
            status: "pending",
            assignedTo: null
        })
    });

    if (!response.ok) {
        throw new Error("Failed to create task");
    }

    const task: Task = await response.json();
    return task;
}

export async function getTask(id: string): Promise<Task> {
    const response = await fetch(
        `http://localhost:3001/tasks/${id}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch task");
    }

    const task: Task = await response.json();

    return task;
}

export async function updateTask(
    id: string,
    taskData: UpdateTask
): Promise<Task> {

    const response = await fetch(
        `http://localhost:3001/tasks/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: taskData.title,
                description: taskData.description,
                status: taskData.status
            })
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update task");
    }

    const task: Task = await response.json();

    return task;
}