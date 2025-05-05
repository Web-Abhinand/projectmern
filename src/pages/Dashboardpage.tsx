import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="container py-5" style={{ display: 'flex', gap: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <Link className="navbar-brand fw-bold" to="/entry" style={{ textDecoration: 'none', color: '#333' }}>
            Entry
          </Link>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <Link className="navbar-brand fw-bold" to="/invoice" style={{ textDecoration: 'none', color: '#333' }}>
            Invoice
          </Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
