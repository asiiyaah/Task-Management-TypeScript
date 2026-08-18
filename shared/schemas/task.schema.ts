import { z } from "zod";


/* -------------------------
   Reusable Task Fields
------------------------- */

const taskTitleSchema = z
    .string()
    .trim()
    .min(1, {
        message: "Title is required",
    })
    .max(100, {
        message: "Title must be 100 characters or less",
    });

const taskDescriptionSchema = z
    .string()
    .trim()
    .max(1000, {
        message: "Description must be 1000 characters or less",
    });


/* -------------------------
   Create Task
------------------------- */

export const CreateTaskSchema = z
    .object({
        title: taskTitleSchema,

        description: taskDescriptionSchema.optional(),
    })
    .strict();


/* -------------------------
   Update Task
------------------------- */

export const UpdateTaskSchema = z
    .object({
        title: taskTitleSchema.optional(),

        description: taskDescriptionSchema
            .nullable()
            .optional(),

        completed: z
            .boolean()
            .optional(),
    })
    .strict()
    .refine(
        (data) =>
            data.title !== undefined ||
            data.description !== undefined ||
            data.completed !== undefined,
        {
            message: "At least one field is required",
        }
    );


/* -------------------------
   Assign Task
------------------------- */

export const AssignTaskSchema = z
    .object({
        userId: z
            .number()
            .int()
            .positive({
                message: "userId must be a positive number",
            }),
    })
    .strict();

/* -------------------------
   TypeScript Types
------------------------- */

export type CreateTaskInput = z.infer<
    typeof CreateTaskSchema
>;

export type UpdateTaskInput = z.infer<
    typeof UpdateTaskSchema
>;

export type AssignTaskInput = z.infer<
    typeof AssignTaskSchema
>;