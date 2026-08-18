import { z } from "zod";


/* -------------------------
   Reusable Auth Fields
------------------------- */

const emailSchema = z
    .string()
    .trim()
    .email({
        message: "Invalid email address",
    });

const passwordSchema = z
    .string()
    .min(6, {
        message: "Password must be at least 6 characters",
    })
    .max(100, {
        message: "Password must be 100 characters or less",
    });


/* -------------------------
   Register
------------------------- */

export const RegisterSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, {
                message: "Name is required",
            })
            .max(100, {
                message: "Name must be 100 characters or less",
            }),

        email: emailSchema,

        password: passwordSchema,
    })
    .strict();


/* -------------------------
   Login
------------------------- */

export const LoginSchema = z
    .object({
        email: emailSchema,

        password: z
            .string()
            .min(1, {
                message: "Password is required",
            }),
    })
    .strict();


/* -------------------------
   TypeScript Types
------------------------- */

export type RegisterInput = z.infer<
    typeof RegisterSchema
>;

export type LoginInput = z.infer<
    typeof LoginSchema
>;