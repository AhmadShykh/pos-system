import React, { useState, useEffect } from 'react';
import CashInvoiceTable from '../Components/CashInvoiceTable';
import ProductTable from '../Components/ProductTable';
import {returnProductsFunc} from '../../db/return.js'

const Return = () => {
  const [action, setAction] = useState('none');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState(null);

  
//   useEffect(() => {
//     fetchInvoices(); // Fetch initial invoices on load
//   }, []);

  const handleActionChange = (newAction) => {
    setAction(newAction);
    setSelectedInvoice(null);
  };

//   const handleAdd = async () => {
//     try {
//       await addCashInvoice(selectedInvoice);
//       alert('Cash Invoice Created');
//       fetchInvoices(); // Refresh the list
//     } catch (error) {
//       console.error('Error adding invoice:', error);
//       alert('Failed to create invoice');
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedInvoice?.id) {
//       alert('Please select an invoice to delete');
//       return;
//     }

//     try {
//       await deleteCashInvoice(selectedInvoice.id);
//       alert('Cash Invoice deleted');
//       fetchInvoices(); // Refresh the list
//       setSelectedInvoice(null);
//     } catch (error) {
//       console.error('Error deleting invoice:', error);
//       alert('Failed to delete invoice');
//     }
//   };

  const handleReturnInvoice = () => {
    if (window.confirm('Are you sure you want to return this invoice?')) {
      alert('Return successful!');
      returnProductsFunc(products)
      // Backend handling instructions
    }
  };

  return (
    <>
        <ProductTable />

    <div className="w-[98%] mx-auto">
      {/* Navigation buttons for Add and Delete actions */}
      <nav className="flex gap-1">
        <button
          onClick={() => handleActionChange('add')}
          className="bg-gray-100 px-5 py-1 active:scale-95 border border-gray-300 mt-2"
        >
          Add
        </button>
        <button
          onClick={() => handleActionChange('delete')}
          className="bg-gray-100 px-5 py-1 active:scale-95 border border-gray-300 mt-2"
        >
          Delete
        </button>
      </nav>

      {/* Cash Invoice Table with increased height */}
      <div className="mt-4 h-[80vh] overflow-auto border border-gray-200">
        <CashInvoiceTable
          formData={selectedInvoice}
          onDataChange={(data) => setProducts({ products: data})}
          mode={action}
        />
      </div>

      {/* Buttons at the bottom: Add/Delete & Return */}
      <div className="flex space-x-2 mt-4">
        <button
          onClick={handleReturnInvoice}
          className="bg-white text-gray-500 px-5 py-1 w-full active:scale-95 border border-gray-300"
        >
          Return
        </button>
      </div>
    </div>
    </>
    
  );
};

export default Return;
