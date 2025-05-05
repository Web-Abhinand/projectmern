import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const baseUrl = 'http://localhost:5000';

const SignupPage = () => {
  const [companyId, setId] = useState('');
  const [companyName, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gst, setGst] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${baseUrl}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({companyId, companyName, gst, email }),
    });
    if (response.ok) {
      navigate('/login');
    } else {
      alert('Signup failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
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
          <div className="mb-3">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={gst}
              onChange={(e) => setGst(e.target.value)}
              placeholder="GST Number"
              className="form-control"
              required
            />
          </div>
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
          <button type="submit" className="btn btn-success w-100">Sign Up</button>
        </form>
        <p className="mt-3 text-center">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="btn btn-link p-0">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
