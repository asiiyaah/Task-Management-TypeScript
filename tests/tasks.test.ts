import request from "supertest";
import app from "../src/app";

describe("GET /", () => {

    test("should return API message", async () => {

        const response = await request(app)
            .get("/");

        expect(response.status).toBe(200);

        expect(response.text)
            .toBe("Task Management API");
    });

});