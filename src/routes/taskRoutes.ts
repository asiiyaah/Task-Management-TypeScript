import { Router } from "express";

import {
    getTasksController,
    getTaskController,
    createTaskController,
    updateTaskController,
    deleteTaskController,
    assignTaskController
} from "../controllers/taskController";

import {
    authMiddleware,
    adminMiddleware
} from "../middleware/authMiddleware";

import { validate } from "../middleware/validationMiddleware";

import {
    CreateTaskSchema,
    UpdateTaskSchema,
    AssignTaskSchema
} from "../../shared/schemas/task.schema";


const router = Router();


router.get(
    "/tasks",
    authMiddleware,
    getTasksController
);


router.get(
    "/tasks/:id",
    authMiddleware,
    getTaskController
);


router.post(
    "/tasks",
    authMiddleware,
    validate(CreateTaskSchema),
    createTaskController
);


router.put(
    "/tasks/:id",
    authMiddleware,
    validate(UpdateTaskSchema),
    updateTaskController
);


router.delete(
    "/tasks/:id",
    authMiddleware,
    deleteTaskController
);


router.post(
    "/tasks/:id/assign",
    authMiddleware,
    adminMiddleware,
    validate(AssignTaskSchema),
    assignTaskController
);


export default router;