const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongo;
let token = "";
let taskId = "";

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  // Register user
  await request(app).post("/api/register").send({
    email: "todo@example.com",
    username: "todouser",
    password: "pass123",
  });

  // Login user
  const res = await request(app).post("/api/login").send({
    username: "todouser",
    password: "pass123",
  });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe("Tasks API", () => {
  it("creates a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "First Task" });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("First Task");
    taskId = res.body._id;
  });

  it("gets all tasks", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("updates a task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it("fails to create task with empty title", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "" });

    expect(res.statusCode).toBe(500); // Fails due to empty required field
  });

  it("rejects getting tasks without token", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("No token provided");
  });

  it("deletes a task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task deleted");
  });
});
