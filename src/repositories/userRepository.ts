import { prisma } from "../lib/prisma";
import { User } from "../types/user";


export async function getUserByEmail(
    email: string
): Promise<User | null> {

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        return null;
    }

    return {
        ...user,
        role: user.role as "admin" | "user"
    };
}


export async function getUserById(
    id: string
): Promise<User | null> {

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    if (!user) {
        return null;
    }

    return {
        ...user,
        role: user.role as "admin" | "user"
    };
}


export async function createUser(
    user: User
): Promise<User> {

    const createdUser = await prisma.user.create({
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role
        }
    });

    return {
        ...createdUser,
        role: createdUser.role as "admin" | "user"
    };
}