import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css'; 
import { ThemeContext, ThemeProvider } from './pages/ThemeContext';
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <ThemeProvider>
    <Router>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/dashboard"
          element={token ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
