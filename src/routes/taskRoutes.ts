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
    authMiddleware
} from "../middleware/authMiddleware";


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
    createTaskController
);


router.put(
    "/tasks/:id",
    authMiddleware,
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
    (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        next();
    },
    assignTaskController
);


export default router;