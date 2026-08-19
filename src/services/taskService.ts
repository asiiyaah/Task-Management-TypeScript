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


function forbiddenError(message = "You do not have permission to perform this action") {
    const error = new Error(message);

    (
        error as Error & {
            statusCode: number
        }
    ).statusCode = 403;

    return error;
}


/* -------------------------
   Get Tasks
------------------------- */

export async function getTasks(
    userId: number,
    role: "user" | "admin"
): Promise<Task[]> {

    if (role === "admin") {
        return await getAllTasks();
    }

    return await getTasksForUser(userId);
}


/* -------------------------
   Get Single Task
------------------------- */

export async function getTask(
    id: number,
    userId: number,
    role: "user" | "admin"
): Promise<Task | null> {

    const task = await getTaskById(id);

    if (!task) {
        return null;
    }

    // Admin can view any task.
    if (role === "admin") {
        return task;
    }

    // Normal users can only view tasks assigned to them.
    if (task.assignedTo !== userId) {
        throw forbiddenError();
    }

    return task;
}


/* -------------------------
   Create Task
------------------------- */

export async function createTask(
    taskData: CreateTaskInput,
    role: "user" | "admin"
): Promise<Task> {

    // Only admins can create tasks.
    if (role !== "admin") {
        throw forbiddenError(
            "Only admins can create tasks"
        );
    }

    return await createTaskRepository({
        title: taskData.title,
        description: taskData.description ?? null,
        assignedTo: null
    });
}


/* -------------------------
   Update Task
------------------------- */

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


    /* -------------------------
       Admin
    ------------------------- */

    if (role === "admin") {

        // Admin can update title,
        // description and assignment-related data.

        // Admin cannot mark tasks as completed.
        if (taskData.completed !== undefined) {
            throw forbiddenError(
                "Admins cannot mark tasks as completed"
            );
        }

        return await updateTaskRepository(
            id,
            taskData
        );
    }


    /* -------------------------
       Normal User
    ------------------------- */

    // User must be assigned to the task.
    if (task.assignedTo !== userId) {
        throw forbiddenError();
    }

    // Users can only mark their assigned task as completed.
    const userUpdate: UpdateTaskInput = {};

    if (taskData.completed !== undefined) {
        userUpdate.completed = taskData.completed;
    }

    // Prevent users from changing title/description.
    if (
        taskData.title !== undefined ||
        taskData.description !== undefined
    ) {
        throw forbiddenError(
            "Users can only update task completion"
        );
    }

    return await updateTaskRepository(
        id,
        userUpdate
    );
}


/* -------------------------
   Delete Task
------------------------- */

export async function deleteTask(
    id: number,
    role: "user" | "admin"
): Promise<boolean> {

    // Only admins can delete tasks.
    if (role !== "admin") {
        throw forbiddenError(
            "Only admins can delete tasks"
        );
    }

    const task = await getTaskById(id);

    if (!task) {
        return false;
    }

    return await deleteTaskRepository(id);
}


/* -------------------------
   Assign Task
------------------------- */

export async function assignTask(
    taskId: number,
    userId: number,
    role: "user" | "admin"
): Promise<Task | null> {

    // Only admins can assign tasks.
    if (role !== "admin") {
        throw forbiddenError(
            "Only admins can assign tasks"
        );
    }

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