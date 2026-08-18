import { Router } from "express";

import {
    registerController,
    loginController,
    getCurrentUserController,
    logoutController,
} from "../controllers/authController";

import { validate } from "../middleware/validationMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

import {
    RegisterSchema,
    LoginSchema
} from "../../shared/schemas/auth.schema";


const router = Router();


router.post(
    "/auth/register",
    validate(RegisterSchema),
    registerController
);


router.post(
    "/auth/login",
    validate(LoginSchema),
    loginController
);


router.get(
    "/auth/me",
    authMiddleware,
    getCurrentUserController
);

router.post(
    "/auth/logout",
    logoutController
);

export default router;