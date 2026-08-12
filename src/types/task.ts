export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    assignedTo?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTasks {
    title: string;
    description?: string;
}

export interface UpdateTask {
    title?: string;
    description?: string;
    completed?: boolean;
    assignedTo?: string;
}