import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { getAllProducts } from "../../db/products.js"; // Import your Firebase function

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  // Fetch product data from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      const productList = await getAllProducts();
      setProducts(productList);
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchProducts();
  }, []);

  // Print function with loading check
  const reactToPrintFn = ()=>{
    console.log(contentRef);
    console.log(contentRef.current);
    useReactToPrint({
    content: () => contentRef.current,
    documentTitle: 'Product_List',
    pageStyle: `
      @page { size: auto; margin: 20mm; }z
      @media print {
        html, body {
          height: initial !important;
          overflow: initial !important;
          -webkit-print-color-adjust: exact;
        }
        .print-container {
          margin-top: 20px;
          padding: 10px;
        }
      }
    `,
    onBeforePrint: () => {
      if (loading) {
        console.log("Data is still loading, delaying print...");
        return new Promise((resolve) => {
          const interval = setInterval(() => {
            if (!loading) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      }
    },
  });
}

  return (
    <div>
      {/* Disable the print button while loading */}
      <button onClick={reactToPrintFn} disabled={loading}>
        {loading ? 'Loading...' : 'Print'}
      </button>

      {/* Content to print */}
      <div ref={contentRef} className="print-container">
        <h1>Product List</h1>
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>VAT Amount</th>
              <th>VAT %</th>
              <th>Qty</th>
              <th>Net Amt (Excl VAT)</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.vatAmount || "N/A"}</td>
                <td>{product.vatPercentage || "N/A"}</td>
                <td>{product.quantity || "N/A"}</td>
                <td>{product.netAmount || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
