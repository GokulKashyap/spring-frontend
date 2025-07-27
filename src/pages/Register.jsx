import { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://spring-backend-8.onrender.com/api/auth/register', {
        email,
        password
      });
      // On successful registration, navigate to login
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    }
  };

  return (
   <div className="auth-container">
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Register</h2>
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
      <button type="submit">Register</button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </form>
  </div>
  );
}

export default Register;
