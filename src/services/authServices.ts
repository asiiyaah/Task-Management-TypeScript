import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
    RegisterInput,
    LoginInput
} from "../../shared/schemas/auth.schema";

import * as userRepository
    from "../repositories/userRepository";

const JWT_SECRET =
    process.env.JWT_SECRET || "my-secret-key";


export async function register(
    data: RegisterInput
) {
    const existingUser =
        await userRepository.getUserByEmail(data.email);

    if (existingUser) {
        const error = new Error("User already exists");

        (error as Error & {
            statusCode: number
        }).statusCode = 409;

        throw error;
    }

    const hashedPassword =
        await bcrypt.hash(data.password, 10);

    const user = {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "user" as const
    };

    const createdUser =
        await userRepository.createUser(user);

    const {
        password,
        ...safeUser
    } = createdUser;

    return safeUser;
}


export async function login(
    data: LoginInput
) {
    const user =
        await userRepository.getUserByEmail(data.email);

    if (!user) {
        const error = new Error(
            "Invalid email or password"
        );

        (error as Error & {
            statusCode: number
        }).statusCode = 401;

        throw error;
    }

    const passwordMatches =
        await bcrypt.compare(
            data.password,
            user.password
        );

    if (!passwordMatches) {
        const error = new Error(
            "Invalid email or password"
        );

        (error as Error & {
            statusCode: number
        }).statusCode = 401;

        throw error;
    }

    const token =
        jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}