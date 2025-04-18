const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe("Auth API", () => {
  it("registers a user", async () => {
    const res = await request(app).post("/api/register").send({
      email: "test@example.com",
      username: "testuser",
      password: "pass123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User created successfully");
  });

  it("rejects duplicate registration", async () => {
    const res = await request(app).post("/api/register").send({
      email: "test@example.com",
      username: "testuser",
      password: "pass123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email or username already exists");
  });

  it("logs in the user with valid credentials", async () => {
    const res = await request(app).post("/api/login").send({
      username: "testuser",
      password: "pass123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("fails login with invalid password", async () => {
    const res = await request(app).post("/api/login").send({
      username: "testuser",
      password: "wrongpass",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
