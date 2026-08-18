import {
    getAllTasks,
    getTasksForUser,
    getTaskById,
    createTask as createTaskRepository,
    updateTask as updateTaskRepository,
    deleteTask as deleteTaskRepository,
    assignTask as assignTaskRepository
} from "../repositories/taskRepository";

import { Task } from "../types/task";

import {
    CreateTaskInput,
    UpdateTaskInput
} from "../../shared/schemas/task.schema";

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
    userId: number,
    role: "user" | "admin"
): Promise<Task[]> {

    if (role === "admin") {
        return await getAllTasks();
    }

    return await getTasksForUser(userId);
}


export async function getTask(
    id: number,
    userId: number,
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
    taskData: CreateTaskInput,
    userId: number
): Promise<Task> {

    return await createTaskRepository({
        title: taskData.title,
        description: taskData.description ?? null,
        createdBy: userId,
        assignedTo: null
    });
}


export async function updateTask(
    id: number,
    taskData: UpdateTaskInput,
    userId: number,
    role: "user" | "admin"
): Promise<Task | null> {

    const task = await getTaskById(id);

    if (!task) {
        return null;
    }

    // Admin can edit title/description,
    // but cannot mark a task as completed.
    if (
        role === "admin" &&
        taskData.completed !== undefined
    ) {
        const error = new Error(
            "Admins cannot mark tasks as completed"
        );

        (
            error as Error & {
                statusCode: number
            }
        ).statusCode = 403;

        throw error;
    }

    // Normal users must be the creator or assignee.
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
    id: number,
    userId: number,
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
    taskId: number,
    userId: number
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