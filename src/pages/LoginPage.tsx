import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const baseUrl = 'http://localhost:5000';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyId, setId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, companyId }),
    });
    if (response.ok) {
      const data = await response.json(); 
      localStorage.setItem('token', data.token); 
      navigate('/dashboard');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={companyId}
              onChange={(e) => setId(e.target.value)}
              placeholder="Company ID"
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="mt-3 text-center">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="btn btn-link p-0">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
