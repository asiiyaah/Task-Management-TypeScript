import { Router } from "express"

import {
    getTasksController,
    createTasksController,
    getTaskController,
    updateTaskController
} from "../controllers/taskController";

const router = Router();

router.get("/tasks",getTasksController);
router.get("/tasks/:id",getTaskController);
router.put("/tasks/:id", updateTaskController);
router.post("/tasks",createTasksController);
export default router;