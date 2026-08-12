export interface Task {
    id: string;
    title: string;
    description: string;
    status: "pending" | "in-progress" | "completed";
    assignedTo: string | null;
}