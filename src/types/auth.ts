export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface JwtPayload {
    userId: string;
    email: string;
    role: "user" | "admin";
}