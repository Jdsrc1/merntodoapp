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

  const styles = {
    container: { maxWidth: "600px", margin: "auto", padding: "2rem", fontFamily: "Arial" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    form: { display: "flex", gap: "10px", marginTop: "1rem" },
    input: { flex: 1, padding: "10px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ccc" },
    button: {
      padding: "10px 15px",
      backgroundColor: "#2980b9",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer"
    },
    section: { marginTop: "2rem" },
    taskItem: {
      backgroundColor: "#f4f6f7",
      padding: "10px",
      marginBottom: "8px",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    taskTitle: { flex: 1 },
    taskButtons: { display: "flex", gap: "8px", marginLeft: "10px" },
    editInput: { flex: 1, padding: "8px", marginRight: "10px", borderRadius: "4px" }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>📝 Todo List</h1>
        <button onClick={logout} style={{ ...styles.button, backgroundColor: "#c0392b" }}>
          Logout
        </button>
      </div>

      <form onSubmit={addTask} style={styles.form}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add</button>
      </form>

      <div style={styles.section}>
        <h2>🕒 Pending Tasks</h2>
        {tasks.filter((t) => !t.completed).map((task) => (
          <div key={task._id} style={styles.taskItem}>
            {editing === task._id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={styles.editInput}
                />
                <button
                  style={styles.button}
                  onClick={() => {
                    updateTask(task._id, { title: editTitle });
                    setEditing(null);
                  }}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span style={styles.taskTitle}>{task.title}</span>
                <div style={styles.taskButtons}>
                  <button onClick={() => updateTask(task._id, { completed: true })}>✔</button>
                  <button onClick={() => {
                    setEditing(task._id);
                    setEditTitle(task.title);
                  }}>✏️</button>
                  <button onClick={() => deleteTask(task._id)}>🗑</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <h2>✅ Completed Tasks</h2>
        {tasks.filter((t) => t.completed).map((task) => (
          <div key={task._id} style={styles.taskItem}>
            <span>{task.title}</span>
            <div style={styles.taskButtons}>
              <button onClick={() => updateTask(task._id, { completed: false })}>↩ Undo</button>
              <button onClick={() => deleteTask(task._id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoPage;
