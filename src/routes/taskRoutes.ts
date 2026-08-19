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


/* -------------------------
   View Tasks
------------------------- */

// Admin → all tasks
// User → only assigned tasks
router.get(
    "/tasks",
    authMiddleware,
    getTasksController
);


// Admin → any task
// User → assigned task only
router.get(
    "/tasks/:id",
    authMiddleware,
    getTaskController
);


/* -------------------------
   Admin Only
------------------------- */

// Create task
router.post(
    "/tasks",
    authMiddleware,
    adminMiddleware,
    validate(CreateTaskSchema),
    createTaskController
);


// Delete task
router.delete(
    "/tasks/:id",
    authMiddleware,
    adminMiddleware,
    deleteTaskController
);


// Assign task
router.post(
    "/tasks/:id/assign",
    authMiddleware,
    adminMiddleware,
    validate(AssignTaskSchema),
    assignTaskController
);


/* -------------------------
   Update Task
------------------------- */

// Admin → edit task
// User → mark assigned task as completed
router.put(
    "/tasks/:id",
    authMiddleware,
    validate(UpdateTaskSchema),
    updateTaskController
);


export default router;