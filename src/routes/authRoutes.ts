import { Router } from "express";

import {
    registerController,
    loginController
} from "../controllers/authController";

import { validate } from "../middleware/validationMiddleware";

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


export default router;