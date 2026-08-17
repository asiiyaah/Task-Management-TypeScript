import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import { errorMiddleware } from "./middleware/errorMiddleware";

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Task Management API");
});

app.use(authRoutes);
app.use(taskRoutes);
app.use(userRoutes);

app.use(errorMiddleware);

export default app;