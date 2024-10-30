// ProductList.js
import React, { useEffect, useState } from "react";
import { printProductList } from "../../db/print.js"; // Adjust the path as necessary

const ProductList = () => {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const loadInvoiceDataListener = (data) => {
      setInvoice(data);
    };

    window.electron.ipcRenderer.on(
      "load-invoice-data",
      loadInvoiceDataListener
    );

    return () => {
      window.electron.ipcRenderer.removeListener(
        "load-invoice-data",
        loadInvoiceDataListener
      );
    };
  }, []);

  const formatCurrency = (value) => {
    const numValue = parseFloat(value);
    return !isNaN(numValue) ? numValue.toFixed(2) : "0.00";
  };
  

  if (!invoice) return <p>Loading...</p>;

  const handlePrint = () => {
    printProductList("product-list"); // Pass CSS filename to the print function
  };

  return (
    <div id="invoice-container" className="w-full p-5 font-sans flex flex-col justify-between h-screen">
      <div id="product-list">
        <div className="text-center mb-5">
          <img
            src="../public/shop-logo.jpg"
            alt="Shop Logo"
            className="w-full h-80"
          />
        </div>

        {/* Hardcoded Customer and Document Details with alternating alignment */}
        <div className="mb-5">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="p-2">
                  <strong>Acc. No:</strong> 02-01-2000
                </td>
                <td className="p-2">
                  <strong>Date:</strong> 27/08/2024
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2">
                  <strong>Name:</strong> QALAT AL MADAM AUTO MAINT W.SHOP
                </td>
                <td className="p-2">
                  <strong>Doc. No:</strong> 02-10853
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2">
                  <strong>Address:</strong> [Customer Address]
                </td>
                <td className="p-2">
                  <strong>Salesman:</strong> HAMZA
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2">
                  <strong>Tel. No. / Fax No.:</strong> [Customer Contact]
                </td>
                <td className="p-2">
                  <strong>Currency:</strong> AED
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2">
                  <strong>Delivery Place:</strong> [Delivery Location]
                </td>
                <td className="p-2">
                  <strong>Terms:</strong> Cash
                </td>
              </tr>
              <tr>
                <td className="p-2" colSpan="2">
                  <strong>Customer TRN:</strong> [TRN Number]
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-5">
          <p className="font-bold">Note:</p>
          <p>Dear Sir/Madam,</p>
          <p>
            In connection with your inquiry, we are pleased to quote our best
            competitive price(s) as per the Terms and Conditions given below.
          </p>
        </div>

        <table className="w-full border-collapse mt-5">
          <thead>
            <tr className="border-b-2">
              <th className="text-left p-2">Sr.No</th>
              <th className="text-left p-2">Product Code</th>
              <th className="text-left p-2">Description</th>
              <th className="text-center p-2">Qty</th>
              <th className="text-right p-2">Unit Price</th>
              <th className="text-right p-2">Net Amt (Excl VAT)</th>
              <th className="text-right p-2">VAT%</th>
              <th className="text-right p-2">VAT Amount</th>
              <th className="text-right p-2">Gross Amt (Incl VAT)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((product, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{product.code}</td>
                <td className="p-2">{product.description}</td>
                <td className="text-center p-2">{product.quantity}</td>
                <td className="text-right p-2">
                  AED {product.unitPrice.toFixed(2)}
                </td>
                <td className="text-right p-2">
                  AED {(product.unitPrice * product.quantity).toFixed(2)}
                </td>
                <td className="text-right p-2">{product.vatPercent}%</td>
                <td className="text-right p-2">
                  AED
                  {(
                    product.unitPrice *
                    product.quantity *
                    (product.vatPercent / 100)
                  ).toFixed(2)}
                </td>
                <td className="text-right p-2">
                  AED
                  {(
                    product.unitPrice *
                    product.quantity *
                    (1 + product.vatPercent / 100)
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Amount Section */}
        <div className="text-right mt-5">
          <p>
            <strong>Sub Total before VAT:</strong> AED {formatCurrency(invoice.subTotal)}
          </p>
          <p>
            <strong>Discount:</strong> AED {formatCurrency(invoice.discount)}
          </p>
          <p>
            <strong>Total before VAT:</strong> AED {formatCurrency(invoice.totalBeforeVAT)}
          </p>
          <p>
            <strong>VAT Amount:</strong> AED {formatCurrency(invoice.vatAmount)}
          </p>
          <p>
            <strong>Total:</strong> AED {formatCurrency(invoice.total)}
          </p>
        </div>
      </div>

      <button
        onClick={handlePrint}
        className="mt-5 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Print Invoice
      </button>
    </div>
  );
};

export default ProductList;
