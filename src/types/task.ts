export interface Task {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    assignedTo: string | null;
}

export interface CreateTasks {
    title: string;
    description?: string;
}

export interface UpdateTask {
    title?: string;
    description?: string | null;
    completed?: boolean;
    assignedTo?: string | null;
}