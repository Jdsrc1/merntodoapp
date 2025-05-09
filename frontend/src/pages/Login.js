import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      navigate('/todo');
    } else {
      setError(data.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login to Your Todo App</h2>
      <form onSubmit={handleLogin} style={styles.form}>
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
        <button type="submit" style={styles.button}>Login</button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
      <p style={{ marginTop: 10 }}>
        Don't have an account? <Link to="/">Register</Link>
      </p>
      <p style={{ marginTop: 5 }}>
        <Link to="/reset-password">Forgot your password?</Link>
      </p>
    </div>
  );
};

const styles = {
  container: { maxWidth: 400, margin: 'auto', padding: 20, textAlign: 'center' },
  heading: { color: '#2d3436' },
  form: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 },
  input: { padding: 10, fontSize: 14, borderRadius: 4, border: '1px solid #ccc' },
  button: { padding: 10, backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: 4 },
  error: { color: 'red', marginTop: 10 }
};

export default Login;
