import request from "supertest";
import app from "../src/app";

describe("GET /tasks", () => {
    it("should return 401 when authentication token is missing", async () => {
        const response = await request(app)
            .get("/tasks");

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Authentication token is required");
    });
});