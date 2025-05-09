import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      navigate('/login');
    } else {
      setError(data.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to the Todo App 👋</h1>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Register</button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: 400, margin: 'auto', padding: 20, textAlign: 'center' },
  heading: { marginBottom: 20, color: '#333' },
  form: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 },
  input: { padding: 10, fontSize: 14, borderRadius: 4, border: '1px solid #ccc' },
  button: { padding: 10, backgroundColor: '#2e86de', color: '#fff', border: 'none', borderRadius: 4 },
  error: { color: 'red', marginTop: 10 }
};

export default Register;
