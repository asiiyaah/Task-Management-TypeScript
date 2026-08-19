import { prisma } from "../lib/prisma";

import { Task } from "../types/task";

import {
    UpdateTaskInput
} from "../../shared/schemas/task.schema";


export async function getAllTasks(): Promise<Task[]> {

    return await prisma.task.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
}


export async function getTasksForUser(
    userId: number
): Promise<Task[]> {

    return await prisma.task.findMany({
        where: {
            assignedTo: userId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}


export async function getTaskById(
    id: number
): Promise<Task | null> {

    return await prisma.task.findUnique({
        where: {
            id
        }
    });
}


export async function createTask(
    task: {
        title: string;
        description: string | null;
        assignedTo: number | null;
    }
): Promise<Task> {

    return await prisma.task.create({
        data: {
            title: task.title,
            description: task.description,
            assignedTo: task.assignedTo
        }
    });
}


export async function updateTask(
    id: number,
    data: UpdateTaskInput
): Promise<Task | null> {

    try {

        return await prisma.task.update({
            where: {
                id
            },
            data
        });

    } catch {

        return null;
    }
}


export async function deleteTask(
    id: number
): Promise<boolean> {

    try {

        await prisma.task.delete({
            where: {
                id
            }
        });

        return true;

    } catch {

        return false;
    }
}


export async function assignTask(
    taskId: number,
    userId: number
): Promise<Task | null> {

    try {

        return await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                assignedTo: userId
            }
        });

    } catch {

        return null;
    }
}