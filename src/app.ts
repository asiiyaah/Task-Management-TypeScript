import express from "express";

import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import { errorMiddleware } from "./middleware/errorMiddleware";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Task Management API");
});

app.use(authRoutes);
app.use(taskRoutes);

app.use(errorMiddleware);

export default app;