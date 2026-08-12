import { Router } from "express"

import { getTasksController,createTasksController } from "../controllers/taskController"

const router = Router();

router.get("/tasks",getTasksController);
router.post("/tasks",createTasksController);
export default router;