import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import './EntryPage.css'; 

const baseUrl = 'http://localhost:5000';

const EntryPage = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);
  const [showProductPopup, setShowProductPopup] = useState(null); // row index
  const [newCustomer, setNewCustomer] = useState({ customerName: '', email: '', address: '' });
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [rows, setRows] = useState([
    { productName: '', qty: '', rate: '', tax: 10, total: 0 }
  ]);
  const [status, setStatus] = useState('Unpaid'); // Default status is Unpaid

  // Fetch customers and products
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      const [customersRes, productsRes] = await Promise.all([
        fetch(`${baseUrl}/api/customers/create`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/products/create`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const customersData = await customersRes.json();
      const productsData = await productsRes.json();
      setCustomers(customersData.customers || []);
      setProducts(productsData.products || []);
    };

    fetchData();
  }, []);

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    const qty = parseFloat(updatedRows[index].qty) || 0;
    const rate = parseFloat(updatedRows[index].rate) || 0;
    const taxRate = parseFloat(updatedRows[index].tax) || 10; // Default to 10% if tax is not defined
    const total = qty * rate * (1 + taxRate / 100); // Calculate total: qty * rate * (1 + taxRate/100)
    updatedRows[index].total = parseFloat(total.toFixed(2)); // Round to 2 decimal places

    setRows(updatedRows);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' && index === rows.length - 1) {
      setRows([...rows, { productName: '', qty: '', rate: '', tax: 10, total: 0 }]);
    }
  };

  const grossTotal = rows.reduce((sum, row) => sum + row.total, 0);

  const handleCustomerSubmit = async () => {
    const token = localStorage.getItem('token');
    await fetch(`${baseUrl}/api/customers/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newCustomer)
    });
    setShowAddCustomer(false);
    setNewCustomer({ customerName: '', email: '', address: '' });
  };

  // Save Invoice function
  const saveInvoice = async () => {
    const token = localStorage.getItem('token');
    const customer = customers.find((cust) => cust.customerName === selectedCustomer);

    if (!customer) {
      alert('Please select a valid customer');
      return;
    }

    const productsData = rows.map((row) => ({
      product: row.productName, // Assuming you want to store the product name as a reference for now
      quantity: row.qty
    }));

    const invoiceData = {
      customerName: customer.customerName,
      products: productsData,
      totalAmount: grossTotal,
      status: status, // Send the status (Paid/Unpaid)
      date: new Date(),
    };
    console.log('invoiceData', invoiceData); // Debugging line
    try {
      const response = await fetch(`${baseUrl}/api/invoices/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(invoiceData),
      });

      const data = await response.json();

      if (response.status === 201) {
        alert('Invoice saved successfully');
        setInvoiceNo(data.invoiceNo); // Set the generated invoice number
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('An error occurred while saving the invoice.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <label>Customer</label>
            <input
              type="text"
              className="form-control"
              value={selectedCustomer}
              onClick={() => setShowCustomerPopup(true)}
              readOnly
            />
            <button className="btn btn-secondary mt-2" onClick={() => setShowAddCustomer(true)}>
              + Add Customer
            </button>
          </div>
          <div className="col-md-6 d-flex">
            <div className="col-md-6">
              <label>Invoice No</label>
              <input
                type="text"
                className="form-control"
                value={invoiceNo || 'Auto-generated after saving'}
                readOnly
              />
            </div>
            <div className="col-md-6">
              <label>Gross Total</label>
              <input type="text" className="form-control" value={grossTotal.toFixed(2)} readOnly />
            </div>
          </div>
        </div>

        <table className="table table-bordered mt-4">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Tax (%)</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} onKeyDown={(e) => handleKeyDown(e, index)}>
                <td>{index + 1}</td>
                <td onClick={() => setShowProductPopup(index)} style={{ cursor: 'pointer' }}>
                  {row.productName || 'Click to select'}
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={row.qty}
                    onChange={(e) => handleRowChange(index, 'qty', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={row.rate}
                    onChange={(e) => handleRowChange(index, 'rate', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={row.tax}
                    onChange={(e) => handleRowChange(index, 'tax', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={row.total.toFixed(2)} // Bind the input value to the calculated total
                    readOnly
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Payment Status */}
        <div className="mt-4">
          <label>Status</label>
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        {/* Save Button */}
        <button className="btn btn-primary mt-4" onClick={saveInvoice}>
          Save Invoice
        </button>
      </div>

      {/* Customer Popup */}
      {showCustomerPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-btn" onClick={() => setShowCustomerPopup(false)}>X</button>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Address</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((cust, idx) => (
                  <tr key={idx} onClick={() => {
                    setSelectedCustomer(cust.customerName);
                    setShowCustomerPopup(false);
                  }}>
                    <td>{cust.customerName}</td>
                    <td>{cust.email}</td>
                    <td>{cust.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Popup */}
      {showProductPopup !== null && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-btn" onClick={() => setShowProductPopup(null)}>X</button>
            <table className="table table-hover">
              <thead>
                <tr><th>Product</th><th>Description</th></tr>
              </thead>
              <tbody>
                {products.map((prod, idx) => (
                  <tr key={idx} onClick={() => {
                    const updated = [...rows];
                    updated[showProductPopup].productName = prod.name;
                    setRows(updated);
                    setShowProductPopup(null);
                  }}>
                    <td>{prod.name}</td>
                    <td>{prod.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Customer Popup */}
      {showAddCustomer && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-btn" onClick={() => setShowAddCustomer(false)}>X</button>
            <h5>Add Customer</h5>
            <input className="form-control mb-2" placeholder="Name" value={newCustomer.customerName} onChange={(e) => setNewCustomer({ ...newCustomer, customerName: e.target.value })} />
            <input className="form-control mb-2" placeholder="Email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} />
            <input className="form-control mb-2" placeholder="Address" value={newCustomer.address} onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })} />
            <button className="btn btn-primary me-2" onClick={handleCustomerSubmit}>Create</button>
            <button className="btn btn-secondary" onClick={() => setShowAddCustomer(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default EntryPage;
