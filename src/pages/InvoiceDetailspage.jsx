import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import './EntryPage.css';

const baseUrl = 'http://localhost:5000';

const InvoiceDetailspage = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch(`${baseUrl}/api/invoices`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        console.log('Invoices:', data);
        if (res.ok) {
          setInvoices(data || []);
        } else {
          console.error('Failed to fetch invoices:', data.error);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>All Invoices</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Customer Name</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((inv) => (
                <tr key={inv._id}>
                  <td>{inv.invoiceNo}</td>
                  <td>{inv.customerName}</td>
                  <td>{inv.totalAmount}</td>
                  <td>{inv.status}</td>
                  <td>{new Date(inv.date).toLocaleDateString()}</td>
                  <td>
                    <ul>
                      {inv.products.map((p, idx) => (
                        <li key={idx}>
                          {typeof p.product === 'object' ? p.product.name : p.product} (Qty: {p.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No invoices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InvoiceDetailspage;
