import { Router } from "express";

import {
    getTasksController,
    createTasksController,
    getTaskController,
    updateTaskController,
    deleteTaskController,
    assignTaskController
} from "../controllers/taskController";

import {
    authMiddleware,
    adminMiddleware
} from "../middleware/authMiddleware";

import {
    validateCreateTask,
    validateUpdateTask,
    validateAssignment
} from "../middleware/validationMiddleware";


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
    validateCreateTask,
    createTasksController
);


router.put(
    "/tasks/:id",
    authMiddleware,
    validateUpdateTask,
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
    validateAssignment,
    assignTaskController
);



export default router;