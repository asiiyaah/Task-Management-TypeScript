const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000";


export interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "user";
}


export interface Task {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
    createdAt: string;
    updatedAt: string;

    createdBy: number;
    assignedTo: number | null;
}


export interface LoginResponse {
    user: User;
}


export interface RegisterResponse {
    message: string;
    user: User;
}


async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        }
    );

    if (!response.ok) {
        let message = "Something went wrong";

        try {
            const data = await response.json();
            message = data.message || message;
        } catch {
            // Ignore invalid JSON
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}


/* =========================
   AUTH
========================= */

export async function login(
    email: string,
    password: string
): Promise<LoginResponse> {

    return request<LoginResponse>(
        "/auth/login",
        {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
        }
    );
}

export async function getCurrentUser(): Promise<{ user: User }> {
    return request<{ user: User }>("/auth/me");
}

export async function logout(): Promise<{ message: string }> {
    return request<{ message: string }>("/auth/logout", {
        method: "POST",
    });
}

export async function register(
    name: string,
    email: string,
    password: string
): Promise<RegisterResponse> {

    return request<RegisterResponse>(
        "/auth/register",
        {
            method: "POST",
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        }
    );
}


/* =========================
   TASKS
========================= */

export async function getTasks(): Promise<Task[]> {

    return request<Task[]>(
        "/tasks"
    );
}


export async function getTask(
    id: number
): Promise<Task> {

    return request<Task>(
        `/tasks/${id}`
    );
}


export async function createTask(
    data: {
        title: string;
        description?: string;
    }
): Promise<Task> {

    return request<Task>(
        "/tasks",
        {
            method: "POST",

            body: JSON.stringify(data),
        }
    );
}


export async function updateTask(
    id: number,
    data: Partial<
        Pick<
            Task,
            "title" |
            "description" |
            "completed"
        >
    >
): Promise<Task> {

    return request<Task>(
        `/tasks/${id}`,
        {
            method: "PUT",

            body: JSON.stringify(data),
        }
    );
}

export async function deleteTask(
    id: number
): Promise<{
    message: string;
}> {

    return request<{
        message: string;
    }>(
        `/tasks/${id}`,
        {
            method: "DELETE",
        }
    );
}


/* =========================
   ADMIN
========================= */

export async function assignTask(
    taskId: number,
    userId: number
): Promise<Task> {

    return request<Task>(
        `/tasks/${taskId}/assign`,
        {
            method: "POST",

            body: JSON.stringify({
                userId,
            }),
        }
    );
}
export async function getUsers(): Promise<User[]> {

    return request<User[]>(
        "/users"
    );
}
