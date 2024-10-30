// ProductList.js
import React, { useEffect, useState } from 'react';
import { printProductList } from '../../db/print.js'; // Adjust the path as necessary

const ProductList = ({ invoiceData }) => {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    setInvoice(invoiceData);
  }, [invoiceData]);

  if (!invoice) return <p>Loading...</p>;

  const handlePrint = () => {
    printProductList("invoice-container"); // Adjust the ID as needed
  };

  return (
    <div id="invoice-container" style={{ width: '100%', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src="path/to/shop-logo.png" alt="Shop Logo" style={{ width: '100%' }} />
        <h2>Shop Name</h2>
        <p>123 Main St, City, State</p>
        <p>Phone: (123) 456-7890 | Email: shop@example.com</p>
      </div>
      <div>
        <p><strong>Invoice #:</strong> {invoice.DocNo}</p>
        <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
        <p><strong>Customer:</strong> {invoice.name}</p>
        <p><strong>Salesman:</strong> {invoice.sMan}</p>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td style={{ textAlign: 'center' }}>{product.quantity}</td>
              <td style={{ textAlign: 'right' }}>${product.price}</td>
              <td style={{ textAlign: 'right' }}>${product.quantity * product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <p><strong>Gross Total:</strong> ${invoice.grossTotal}</p>
        <p><strong>Discount:</strong> ${invoice.discount}</p>
        <p><strong>VAT:</strong> ${invoice.vatAmount}</p>
        <p><strong>Net Total:</strong> ${invoice.netTotal}</p>
      </div>
      <button onClick={handlePrint} style={{ marginTop: '20px' }}>Print Invoice</button>
    </div>
  );
};

export default ProductList;