import { prisma } from "../lib/prisma";
import { User } from "../types/user";


export async function getUserByEmail(
    email: string
): Promise<User | null> {

    return await prisma.user.findUnique({
        where: {
            email
        }
    });
}


export async function getUserById(
    id: string
): Promise<User | null> {

    return await prisma.user.findUnique({
        where: {
            id
        }
    });
}


export async function createUser(
    user: User
): Promise<User> {

    return await prisma.user.create({
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role
        }
    });
}