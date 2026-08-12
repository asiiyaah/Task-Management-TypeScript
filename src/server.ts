import express from "express";
import taskRoutes from "./routes/taskRoutes";

const app = express();

app.use(express.json());

app.use(taskRoutes);

app.get("/", (req, res) => {
    res.send("Task Management API");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});