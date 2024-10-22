import React, { useEffect, useState } from "react";
import MachineProductSelector from "./MachineProductSearch";

function CashInvoiceTable({ formData, onDataChange, Rows, mode }) {
  const [rows, setRows] = useState([]);
  const [nextSiNo, setNextSiNo] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  useEffect(() => {
    if (Rows && Rows.length > 0) {
      setRows(Rows);
      const maxSiNo = Math.max(...Rows.map((row) => row.siNo));
      setNextSiNo(maxSiNo + 1);
    }
  }, [Rows]);

  const handleAddRow = () => {
    const newRow = {
      siNo: nextSiNo,
      type: "",
      productCode: "",
      brand: "",
      description: "",
      unit: "",
      quantity: 1,
      gAmount: 0,
      discount: 0,
      totalVat: 0,
    };
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    setNextSiNo(nextSiNo + 1);
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

  /**
   *
   * @param {import("../../db/products").Product} product
   */

  const handleProductSelect = (product) => {
    if (selectedRowIndex !== null) {
      let duplicate = false;
      let updatedRows = rows.map((row, index) => {
        if (index === selectedRowIndex) {
          return {
            ...row,
            brand: product.brand,
            description: product.name,
            unit: product.basicUnit,
            // TODO: Fix this
            totalVat: Number(product.vatType),
            productCode: product.productCode,
            gAmount: Number(product.sellingPrice1),
          };
        } else if (
          index !== selectedRowIndex &&
          row.productCode === product.productCode
        ) {
          duplicate = true;
          return {
            ...row,
            quantity: row.quantity + 1,
          };
        }
        return row;
      });
      if (duplicate) {
        updatedRows = updatedRows.filter((row, i) => i !== selectedRowIndex);
      }

      setRows(updatedRows);
      onDataChange(updatedRows);
    }
    handleCloseModal();
  };

  return (
    <div className="mt-6 min-h-[10vh] w-[98%] mx-auto">
      <button
        onClick={handleAddRow}
        className="bg-white text-black border-gray-300 border  px-6 py-2 mb-3 focus:scale-95"
        type="button"
      >
        Add Product
      </button>
      <div className="min-h-[30vh] max-h-[30vh] scrollbar overflow-auto bg-blue-100">
        <table className="w-full border-collapse border border-gray-300 bg-blue-100">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="border border-gray-300 px-1 italic font-bold text-sm bg-yellow-100 text-black">
                S.I No
              </th>
              <th className="border border-gray-300 px-1 font-normal text-sm">
                Type
              </th>
              <th className="border border-gray-300 px-1 font-normal text-sm">
                Product Code
              </th>
              <th className="border border-gray-300 px-1 font-normal text-sm">
                Brand
              </th>
              <th className="border border-gray-300 px-1 font-normal text-sm">
                Description
              </th>
              <th className="border border-gray-300 px-1 font-normal text-sm">
                Unit
              </th>
              <th className="border border-gray-300 px-1 font-normal text-sm">
                Quantity
              </th>
              <th className="border border-gray-300 px-1 font-normal text-sm">
                G. Amount
              </th>
              <th className="border border-gray-300 px-1 font-normal text-sm">
                Discount %
              </th>
              <th className="border border-gray-300 px-1 font-normal text-sm">
                Total VAT %
              </th>
              <th className="border border-gray-300 px-1 font-normal text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.siNo}>
                <td className="border min-w-20 border-gray-300 text-center">
                  {row.siNo}
                </td>
                <td className="border border-gray-300 px-1">
                  <input
                    type="text"
                    value={row.type}
                    onChange={(e) =>
                      handleInputChange(index, "type", e.target.value)
                    }
                    className="bg-transparent outline-none focus:bg-white"
                    disabled={mode === "delete"}
                  />
                </td>
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
                    value={row.brand}
                    onChange={(e) =>
                      handleInputChange(index, "brand", e.target.value)
                    }
                    disabled={mode === "delete"}
                    className="w-full bg-transparent outline-none focus:bg-white"
                  />
                </td>
                <td className="border border-gray-300 px-1">
                  <input
                    type="text"
                    value={row.description}
                    onChange={(e) =>
                      handleInputChange(index, "description", e.target.value)
                    }
                    className="w-full bg-transparent outline-none focus:bg-white"
                    disabled={mode === "delete"}
                  />
                </td>
                <td className="border border-gray-300 px-1">
                  <input
                    type="text"
                    value={row.unit}
                    onChange={(e) =>
                      handleInputChange(index, "unit", e.target.value)
                    }
                    className="w-full bg-transparent outline-none focus:bg-white"
                    disabled={mode === "delete"}
                  />
                </td>
                <td className="border border-gray-300 px-1">
                  <input
                    type="number"
                    value={row.quantity}
                    min={0}
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
                    value={row.gAmount}
                    min={0}
                    onChange={(e) =>
                      handleInputChange(index, "gAmount", e.target.value)
                    }
                    disabled={mode === "delete"}
                    className="w-full bg-transparent outline-none focus:bg-white"
                  />
                </td>
                <td className="border border-gray-300 px-1">
                  <input
                    type="number"
                    value={row.discount}
                    min={0}
                    onChange={(e) =>
                      handleInputChange(index, "discount", e.target.value)
                    }
                    disabled={mode === "delete"}
                    className="w-full bg-transparent outline-none focus:bg-white"
                  />
                </td>
                <td className="border border-gray-300 px-1">
                  <input
                    type="number"
                    value={row.totalVat}
                    min={0}
                    onChange={(e) =>
                      handleInputChange(index, "totalVat", e.target.value)
                    }
                    className="w-full bg-transparent outline-none focus:bg-white"
                    disabled={mode === "delete"}
                  />
                </td>
                <td className="border border-gray-300 py-1 text-center px-1">
                  <button
                    onClick={() => handleDeleteRow(index)}
                    className="text-red-500"
                    type="button"
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
            <button
              className="text-red-500 mb-2"
              type="button"
              onClick={handleCloseModal}
            >
              Close
            </button>
            <MachineProductSelector onProductSelect={handleProductSelect} />
          </div>
        </div>
      )}
    </div>
  );
}

export default CashInvoiceTable;
