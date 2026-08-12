import {
    getAllTasks,
    getTaskById,
    createTask as createTaskRepository,
    updateTask as updateTaskRepository,
    deleteTask as deleteTaskRepository,
    assignTask as assignTaskRepository
} from "../repositories/taskRepository";

import {
    Task,
    CreateTasks,
    UpdateTask
} from "../types/task";

import * as userRepository
    from "../repositories/userRepository";


export async function getTasks(): Promise<Task[]> {

    return await getAllTasks();
}


export async function getTask(
    id: string
): Promise<Task | null> {

    return await getTaskById(id);
}


export async function createTask(
    taskData: CreateTasks
): Promise<Task> {

    const task: Task = {
        id: Date.now().toString(),
        title: taskData.title,
        description: taskData.description,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    return await createTaskRepository(task);
}


export async function updateTask(
    id: string,
    taskData: UpdateTask
): Promise<Task | null> {

    return await updateTaskRepository(
        id,
        taskData
    );
}


export async function deleteTask(
    id: string
): Promise<boolean> {

    return await deleteTaskRepository(id);
}


export async function assignTask(
    taskId: string,
    userId: string
): Promise<Task | null> {

    // Check whether the user exists
    const user =
        await userRepository.getUserById(userId);

    if (!user) {
        const error = new Error("User not found");

        (
            error as Error & {
                statusCode: number
            }
        ).statusCode = 404;

        throw error;
    }

    // User exists, so assign the task
    return await assignTaskRepository(
        taskId,
        userId
    );
}