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

app.listen(3000, () => {
    console.log(
        "Express server running on http://localhost:3000"
    );
});