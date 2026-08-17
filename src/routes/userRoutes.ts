import { Router } from "express";

import {
    getUsersController
} from "../controllers/userController";

import {
    authMiddleware
} from "../middleware/authMiddleware";


const router = Router();


router.get(
    "/users",
    authMiddleware,
    getUsersController
);


export default router;