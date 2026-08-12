import { Router } from "express"

import { getTasksController,getTaskController,createTasksController } from "../controllers/taskController"

const router = Router();

router.get("/tasks",getTasksController);
router.get("/tasks/:id",getTaskController);
router.post("/tasks",createTasksController);
export default router;