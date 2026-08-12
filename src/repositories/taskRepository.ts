import { Task, UpdateTask } from "../types/task";

const DB_URL = "http://localhost:3001/tasks";


export async function getAllTasks(): Promise<Task[]> {

    const response = await fetch(DB_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch tasks");
    }

    return response.json();
}


export async function getTaskById(
    id: string
): Promise<Task | null> {

    const response = await fetch(`${DB_URL}/${id}`);

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to fetch task");
    }

    return response.json();
}


export async function createTask(
    task: Task
): Promise<Task> {

    const response = await fetch(DB_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        throw new Error("Failed to create task");
    }

    return response.json();
}


export async function updateTask(
    id: string,
    taskData: UpdateTask
): Promise<Task | null> {

    const response = await fetch(`${DB_URL}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ...taskData,
            updatedAt: new Date().toISOString()
        })
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to update task");
    }

    return response.json();
}


export async function deleteTask(
    id: string
): Promise<boolean> {

    const response = await fetch(`${DB_URL}/${id}`, {
        method: "DELETE"
    });

    if (response.status === 404) {
        return false;
    }

    if (!response.ok) {
        throw new Error("Failed to delete task");
    }

    return true;
}


export async function assignTask(
    taskId: string,
    userId: string
): Promise<Task | null> {

    const response = await fetch(`${DB_URL}/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            assignedTo: userId,
            updatedAt: new Date().toISOString()
        })
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to assign task");
    }

    return response.json();
}