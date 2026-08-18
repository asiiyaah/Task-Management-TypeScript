export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
}

export interface PublicUser {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
}