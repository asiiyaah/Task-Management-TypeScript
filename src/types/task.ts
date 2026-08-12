export interface Task {
    id: string;
    title: string;
    description: string;
    status: "pending" | "in-progress" | "completed";
    assignedTo: string | null;
}

export interface CreateTasks {
    title: string;
    description: string;
}

export interface UpdateTask {
    title: string;
    description: string;
    status: string;
}