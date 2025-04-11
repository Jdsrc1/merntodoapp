import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TodoPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (!token) return navigate("/login");
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTask }),
    });
    setNewTask("");
    fetchTasks();
  };

  const updateTask = async (id, updatedData) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Todo List</h1>
      <button onClick={logout}>Logout</button>

      <form onSubmit={addTask} style={{ marginTop: "1rem" }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task..."
        />
        <button type="submit">Add</button>
      </form>

      <h2>Pending Tasks</h2>
      <ul>
        {tasks
          .filter((t) => !t.completed)
          .map((task) => (
            <li key={task._id}>
              {editing === task._id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <button onClick={() => {
                    updateTask(task._id, { title: editTitle });
                    setEditing(null);
                  }}>Save</button>
                </>
              ) : (
                <>
                  {task.title}
                  <button onClick={() => updateTask(task._id, { completed: true })}>✔</button>
                  <button onClick={() => {
                    setEditing(task._id);
                    setEditTitle(task.title);
                  }}>✏️</button>
                  <button onClick={() => deleteTask(task._id)}>🗑</button>
                </>
              )}
            </li>
          ))}
      </ul>

      <h2>Completed Tasks</h2>
      <ul>
        {tasks
          .filter((t) => t.completed)
          .map((task) => (
            <li key={task._id}>
              {task.title}
              <button onClick={() => updateTask(task._id, { completed: false })}>
                ↩ Undo
              </button>
              <button onClick={() => deleteTask(task._id)}>🗑</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TodoPage;
