import { prisma } from "../lib/prisma";
import { Task, UpdateTask } from "../types/task";


export async function getAllTasks(): Promise<Task[]> {

    return await prisma.task.findMany();
}

export async function getTasksByAssignee(
    userId: string
): Promise<Task[]> {

    return await prisma.task.findMany({
        where: {
            assignedTo: userId
        }
    });
}

export async function getTaskById(
    id: string
): Promise<Task | null> {

    return await prisma.task.findUnique({
        where: {
            id
        }
    });
}


export async function createTask(
    task: Task
): Promise<Task> {

    return await prisma.task.create({
        data: {
            id: task.id,
            title: task.title,
            description: task.description,
            completed: task.completed,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt)
        }
    });
}


export async function updateTask(
    id: string,
    taskData: UpdateTask
): Promise<Task | null> {

    try {

        return await prisma.task.update({
            where: {
                id
            },
            data: {
                ...taskData
            }
        });

    } catch (error) {

        return null;
    }
}


export async function deleteTask(
    id: string
): Promise<boolean> {

    try {

        await prisma.task.delete({
            where: {
                id
            }
        });

        return true;

    } catch (error) {

        return false;
    }
}


export async function assignTask(
    taskId: string,
    userId: string
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

    } catch (error) {

        return null;
    }
}