import React, { useEffect, useState, useRef } from 'react';
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


  return (
    <div>
      

      {/* Content to print */}
      <div className="print-container">
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
