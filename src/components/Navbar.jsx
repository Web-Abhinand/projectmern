import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const baseUrl = 'http://localhost:5000';
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('Loading...');
  const [userName, setUserName] = useState('');

  const handleLogout = async () => {
    await fetch(`${baseUrl}/api/logout`, { method: 'POST' });
    localStorage.removeItem('token'); // clear token on logout
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchCompanyName = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/company`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch company name');
        const data = await res.json();
        setCompanyName(data.companyName);
      } catch (err) {
        console.error('Error fetching company name:', err);
        setCompanyName('Unknown Company');
      }
    };

    const fetchUserName = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch user name');
        const data = await res.json();
        setUserName(data.name);
      } catch (err) {
        console.error('Error fetching user name:', err);
        setUserName('');
      }
    };

    if (token) {
      fetchCompanyName();
      fetchUserName();
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          {companyName}
        </Link>

        <div className="d-flex align-items-center text-white me-3">
          <span className="me-3">Hello, {userName || 'User'}</span>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
