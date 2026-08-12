import { User } from "../types/user";

const DB_URL = "http://localhost:3001/users";


export async function getUserByEmail(
    email: string
): Promise<User | null> {

    const response = await fetch(
        `${DB_URL}?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }

    const users: User[] = await response.json();

    return users.length > 0 ? users[0] : null;
}


export async function getUserById(
    id: string
): Promise<User | null> {

    const response = await fetch(`${DB_URL}/${id}`);

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }

    return response.json();
}


export async function createUser(
    user: User
): Promise<User> {

    const response = await fetch(DB_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if (!response.ok) {
        throw new Error("Failed to create user");
    }

    return response.json();
}