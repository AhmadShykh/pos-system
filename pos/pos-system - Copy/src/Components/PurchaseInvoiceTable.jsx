import React, { useEffect, useState } from "react";
import MachineProductSelector from "./MachineProductSearch";

function PurchaseInvoiceTable({ initialRows, onDataChange, mode }) {
  const [rows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  useEffect(() => {
    if (initialRows && initialRows.length > 0) {
      setRows(initialRows);
    }
  }, [initialRows]);

  const handleAddRow = () => {
    const newRow = {
      productCode: "",
      name: "",
      quantity: 1,
      price: "",
    };
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    onDataChange(updatedRows);
  };

  const handleDeleteRow = (index) => {
    const newRows = rows.filter((row, i) => i !== index);
    setRows(newRows);
    onDataChange(newRows);
  };

  const handleInputChange = (index, field, value) => {
    const newRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(newRows);
    onDataChange(newRows);
  };

  const handleOpenModal = (index) => {
    setSelectedRowIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRowIndex(null);
  };

  const handleProductSelect = (product) => {
    if (selectedRowIndex !== null) {
      const updatedRows = rows.map((row, index) => {
        if (index === selectedRowIndex) {
          return {
            ...row,
            productCode: product.productCode,
            name: product.name,
            price: product.sellingPrice1,
          };
        }
        return row;
      });

      setRows(updatedRows);
      onDataChange(updatedRows);
    }
    handleCloseModal();
  };

  return (
    <div className="mt-6 min-h-[10vh] w-[98%] mx-auto">
      {mode !== "none" && mode !== "Delete" && (
        <button
          onClick={handleAddRow}
          className="bg-white text-black border-gray-300 border px-6 py-2 mb-3 focus:scale-95"
          type="button"
        >
          Add Product
        </button>
      )}
      <div className="min-h-[30vh] max-h-[30vh] scrollbar overflow-auto bg-blue-100">
        <table className="w-full border-collapse border border-gray-300 bg-blue-100 ">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="border border-gray-300 px-1 font-normal text-sm">
                Product Code
              </th>
              <th className="border border-gray-300 px-1 font-normal text-sm">
                Name
              </th>
              <th className="border border-gray-300 px-1 font-normal text-sm">
                Quantity
              </th>
              <th className="border border-gray-300 px-1 font-normal text-sm">
                Price
              </th>
              <th className="border border-gray-300 px-1 font-normal text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-1">
                  <input
                    type="text"
                    value={row.productCode}
                    onClick={() => handleOpenModal(index)}
                    readOnly
                    className="w-full bg-transparent outline-none cursor-pointer focus:bg-white"
                    disabled={mode === "delete"}
                  />
                </td>
                <td className="border border-gray-300 px-1">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                    disabled={mode === "delete"}
                    className="w-full bg-transparent outline-none focus:bg-white"
                  />
                </td>
                <td className="border border-gray-300 px-1">
                  <input
                    type="number"
                    value={row.quantity}
                    onChange={(e) =>
                      handleInputChange(index, "quantity", e.target.value)
                    }
                    className="w-full bg-transparent outline-none focus:bg-white"
                    disabled={mode === "delete"}
                  />
                </td>
                <td className="border border-gray-300 px-1">
                  <input
                    type="number"
                    value={row.price}
                    onChange={(e) =>
                      handleInputChange(index, "price", e.target.value)
                    }
                    disabled={mode === "delete"}
                    className="w-full bg-transparent outline-none focus:bg-white"
                  />
                </td>
                <td className="border border-gray-300 py-1 text-center px-1">
                  <button
                    onClick={() => handleDeleteRow(index)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="p-4 rounded shadow-lg max-w-[95vw] min-w-[95vw] bg-background">
            <button className="text-red-500 mb-2" onClick={handleCloseModal}>
              Close
            </button>
            <MachineProductSelector onProductSelect={handleProductSelect} />
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseInvoiceTable;
