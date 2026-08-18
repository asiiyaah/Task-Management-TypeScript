export interface JwtPayload {
    userId: number;
    email: string;
    role: "user" | "admin";
}