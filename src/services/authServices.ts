import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
    RegisterRequest,
    LoginRequest
} from "../types/auth";

import { User } from "../types/user";

import * as userRepository
    from "../repositories/userRepository";

const JWT_SECRET =
    process.env.JWT_SECRET || "my-secret-key";

export async function register(
    data: RegisterRequest
) {
    const existingUser =
        await userRepository.getUserByEmail(data.email);

    if (existingUser) {
        const error = new Error("User already exists");

        (error as Error & { statusCode: number }).statusCode = 409;

        throw error;
    }

    const hashedPassword =
        await bcrypt.hash(data.password, 10);

    const user: User = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "user"
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
    data: LoginRequest
) {
    const user =
        await userRepository.getUserByEmail(data.email);

    if (!user) {
        const error = new Error(
            "Invalid email or password"
        );

        (error as Error & { statusCode: number }).statusCode = 401;

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

        (error as Error & { statusCode: number }).statusCode = 401;

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