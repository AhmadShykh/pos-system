import React, { useState, useEffect } from "react";
import { getAllProducts, getProductsWithFilters } from "../../db/products";
import { getAllCategories } from "../../db/category";

/**
 * @typedef {import("../../db/products").Product} Product
 */

const MachineSelector = ({ machines, onSelectMachine }) => {
  return (
    <select
      onChange={(e) => onSelectMachine(e.target.value)}
      className="w-full border p-1 mb-2"
    >
      <option value="">Select Machine</option>
      {machines.map((machine) => (
        <option key={machine.id} value={machine.id}>
          {machine.shortForm} : {machine.name}
        </option>
      ))}
    </select>
  );
};

const SubmachineSelector = ({ submachines, onSelectSubmachine }) => {
  return (
    <select
      onChange={(e) => onSelectSubmachine(e.target.value)}
      className="w-full border p-1 mb-2"
    >
      <option value="">Select Submachine</option>
      {submachines.map((submachine) => (
        <option key={submachine.shortForm} value={submachine.shortForm}>
          {submachine.shortForm} : {submachine.name}
        </option>
      ))}
    </select>
  );
};

const ProductList = ({ products, onSelectProduct }) => {
  const allColumns = Object.keys(products.length > 0 ? products[0] : {});
  const excludeColumns = ["alternatives", "appliedModels", "picture"];
  const columns = allColumns.filter(
    (column) => !excludeColumns.includes(column)
  );

  const handleRowClick = (product) => {
    onSelectProduct(product);
  };

  return (
    <table
      className="min-w-full max-w-full overflow-auto  border "
      style={{ zIndex: 500 }}
    >
      <thead>
        <tr className="text-white bg-blue-800">
          {columns.map((col, index) => (
            <th
              key={index}
              className="py-1 px-4 text-sm font-normal border-b text-left"
            >
              {col
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-blue-100 ">
        {products.map((product, index) => {
          return (
            <tr
              key={index}
              className="cursor-pointer hover:bg-gray-100 py-1 text-sm "
              onClick={() => handleRowClick(product)}
            >
              {columns.map((col, index) => (
                <td key={index} className={`py-2 px-4 border-b`}>
                  {typeof product[col] === "string" && product[col].length > 10
                    ? product[col].substring(0, 10) + "..."
                    : product[col]}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const MachineProductSelector = ({ onProductSelect, productCode }) => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedSubmachine, setSelectedSubmachine] = useState(null);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };
    fetchData();
  }, []);

  /**
   * @type {[Product[], Function]}
   */
  const [products, setProducts] = useState([]);
  const [productNameSearch, setProductNameSearch] = useState("");
  const [oemSearch, setOemSearch] = useState("");
  const [uniqueIdSearch, setUniqueIdSearch] = useState("");
  const [productCodeSearch, setProductCodeSearch] = useState(""); // New state for product code search

  // const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const products = await getAllProducts();
      setProducts(products);
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    // console.log({ selectedMachine, selectedSubmachine });
    if (selectedMachine) {
      const isAvail = product.appliedModels.some(
        (model) =>
          model.make.toLowerCase() === selectedMachine.shortForm.toLowerCase()
      );
      if (!isAvail) return false;
    }
    if (selectedSubmachine) {
      const isAvail = product.appliedModels.some(
        (model) =>
          model.type.toLowerCase() ===
          selectedSubmachine.shortForm.toLowerCase()
      );
      if (!isAvail) return false;
    }
    return (
      product.name.toLowerCase().includes(productNameSearch.toLowerCase()) &&
      product.uniqueId.toLowerCase().includes(uniqueIdSearch.toLowerCase()) &&
      product.productCode
        .toLowerCase()
        .includes(productCodeSearch.toLowerCase())
    );
  });

  const handleMachineSelect = (machineId) => {
    const machine = categories.find((m) => m.id === parseInt(machineId));
    setSelectedMachine(machine);
    setSelectedSubmachine(null); // Reset submachine selection
  };

  const handleSubmachineSelect = (submachineId) => {
    const submachine = selectedMachine.subCategories.find(
      (sm) => sm.shortForm === submachineId
    );
    setSelectedSubmachine(submachine);
  };

  const handleProductSelect = (product) => {
    onProductSelect(product);
  };

  return (
    <div
      className="flex min-h-[70vh] max-h-[70vh] bg-background scrollbar relative"
      style={{ zIndex: 100 }}
    >
      <div className="w-[15%] p-4">
        <h2 className="font-bold mb-2">Machines</h2>
        <MachineSelector
          machines={categories}
          onSelectMachine={handleMachineSelect}
        />
        {selectedMachine && (
          <SubmachineSelector
            submachines={selectedMachine.subCategories}
            onSelectSubmachine={handleSubmachineSelect}
          />
        )}
      </div>

      {/* Input fields and Product List */}
      <div className="w-[85%] p-4">
        <h2 className="mb-2">Products</h2>
        <div className="mb-2 flex gap-2">
          <input
            type="text"
            placeholder="Search by Product Name"
            value={productNameSearch}
            onChange={(e) => setProductNameSearch(e.target.value)}
            className="w-full border p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Search by Product Code"
            value={productCode || productCodeSearch}
            onChange={(e) => setProductCodeSearch(e.target.value)}
            className="w-full border p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Search by OEM Code"
            value={oemSearch}
            onChange={(e) => setOemSearch(e.target.value)}
            className="w-full border p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Search by Unique ID"
            value={uniqueIdSearch}
            onChange={(e) => setUniqueIdSearch(e.target.value)}
            className="w-full border p-2 mb-2"
          />
        </div>
        {/* Container for the table with fixed height */}
        <div className="overflow-auto" style={{ maxHeight: "50vh" }}>
          <ProductList
            products={filteredProducts}
            onSelectProduct={handleProductSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default MachineProductSelector;
