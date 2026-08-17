import {
    getAllTasks,
    getTasksForUser,
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


function forbiddenError() {

    const error = new Error(
        "You do not have permission to access this task"
    );

    (
        error as Error & {
            statusCode: number
        }
    ).statusCode = 403;

    return error;
}


export async function getTasks(
    userId: string,
    role: "user" | "admin"
): Promise<Task[]> {

    if (role === "admin") {
        return await getAllTasks();
    }

    return await getTasksForUser(userId);
}


export async function getTask(
    id: string,
    userId: string,
    role: "user" | "admin"
): Promise<Task | null> {

    const task = await getTaskById(id);

    if (!task) {
        return null;
    }

    if (role === "admin") {
        return task;
    }

    const hasAccess =
        task.createdBy === userId ||
        task.assignedTo === userId;

    if (!hasAccess) {
        throw forbiddenError();
    }

    return task;
}


export async function createTask(
    taskData: CreateTasks,
    userId: string
): Promise<Task> {

    const task: Task = {
        id: Date.now().toString(),
        title: taskData.title,
        description: taskData.description ?? null,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        assignedTo: null
    };

    return await createTaskRepository(task);
}


export async function updateTask(
    id: string,
    taskData: UpdateTask,
    userId: string,
    role: "user" | "admin"
): Promise<Task | null> {

    const task = await getTaskById(id);

    if (!task) {
        return null;
    }

    if (role !== "admin") {

        const hasAccess =
            task.createdBy === userId ||
            task.assignedTo === userId;

        if (!hasAccess) {
            throw forbiddenError();
        }
    }

    return await updateTaskRepository(
        id,
        taskData
    );
}


export async function deleteTask(
    id: string,
    userId: string,
    role: "user" | "admin"
): Promise<boolean> {

    const task = await getTaskById(id);

    if (!task) {
        return false;
    }

    if (role !== "admin") {

        const hasAccess =
            task.createdBy === userId ||
            task.assignedTo === userId;

        if (!hasAccess) {
            throw forbiddenError();
        }
    }

    return await deleteTaskRepository(id);
}


export async function assignTask(
    taskId: string,
    userId: string
): Promise<Task | null> {

    const user =
        await userRepository.getUserById(userId);

    if (!user) {

        const error =
            new Error("User not found");

        (
            error as Error & {
                statusCode: number
            }
        ).statusCode = 404;

        throw error;
    }

    return await assignTaskRepository(
        taskId,
        userId
    );
}