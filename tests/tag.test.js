const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();

// beforeEach(async () => {
//   await mongoose.connect(process.env.MONGODB_URI);
// });

// afterEach(async () => {
//   await mongoose.connection.close();
// });

describe("GET /print/tag", () => {
    it("should return all products", async () => {
        return request(app)
            .get("/api/product/get")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.statusCode).toBe(200);
            })
    });
});
