import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Task Management API");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});