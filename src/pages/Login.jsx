import { useState } from 'react';
import './AuthForm.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://spring-backend-8.onrender.com/api/auth/login', {
  email,
  password
}, {
  headers: {
    'Content-Type': 'application/json'
  }
});

      const token = res.data.token;
      localStorage.setItem('token', token);
      onLogin(token);
      navigate('/dashboard'); 
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-container">
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </form>
  </div>
  );
}

export default Login;
