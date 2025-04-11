
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/AuthMiddleware");
const Task = require("../models/Task");

router.use(authMiddleware);

// Get all tasks for user
router.get("/", async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

// Add task
router.post("/", async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    userId: req.userId,
  });
  res.status(201).json(task);
});

// Update task
router.put("/:id", async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  res.json(task);
});

// Delete task
router.delete("/:id", async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Deleted" });
});

module.exports = router;
