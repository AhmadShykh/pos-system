import React, { useEffect, useState } from "react";
import Popup from "../Components/Popup";
import PurchaseInvoiceTable from "../Components/PurchaseInvoiceTable";
import {
  addPurchaseInvoice,
  deletePurchaseInvoice,
  getAllPurchaseInvoices,
  updatePurchaseInvoice,
} from "../../db/purchaseInvoice";
import { getSuppliers } from "../../db/customers";

/**
 * @typedef {import('../../db/purchaseInvoice').PurchaseInvoice} PurchaseInvoice
 * @typedef {import('../../db/customers').Customer} Customer
 */

function formatDate(date) {
  if (!(date instanceof Date)) {
    throw new Error("Input must be a Date object");
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  // Return the formatted date string
  return `${day}/${month}/${year}`;
}

function PurchaseInvoice({ mode, initialInvoice }) {
  // State to track the selected action
  const [action, setAction] = useState(mode || "none");
  const [selectedInvoice, setSelectedInvoice] = useState(
    initialInvoice || null
  );

  /**
   * @type {[Customer[], import('react').Dispatch<import('react').SetStateAction<Customer[]>]}
   */
  const [suppliers, setSuppliers] = useState([]);

  /**
   * @type {[PurchaseInvoice[], import('react').Dispatch<import('react').SetStateAction<PurchaseInvoice[]>>]}
   */
  const [invoices, setInvoices] = useState([]);

  const fetchInvoices = async () => {
    const invoices = await getAllPurchaseInvoices();
    setInvoices(invoices);
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch suppliers
      const suppliers = await getSuppliers();
      setSuppliers(suppliers);
      fetchInvoices();
    };
    fetchData();
  }, []);

  const handleInvoiceSelect = (receivedItem) => {
    setSelectedInvoice(receivedItem);
  };

  // Function to handle changing actions
  const handleActionChange = (newAction) => {
    setAction(newAction);
    setSelectedInvoice(null);
  };

  return (
    <div>
      <div className="w-[98%] mx-auto">
        <nav className="flex gap-1">
          <button
            onClick={() => handleActionChange("Add")}
            className="bg-gray-100 px-5 py-1 active:scale-95 border border-gray-300 mt-2"
          >
            Add
          </button>
          <button
            onClick={() => handleActionChange("Edit")}
            className="bg-gray-100 px-5 py-1 active:scale-95 border border-gray-300 mt-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleActionChange("Delete")}
            className="bg-gray-100 px-5 py-1 active:scale-95 border border-gray-300 mt-2"
          >
            Delete
          </button>
        </nav>

        {action === "none" && (
          <PurchaseForm
            mode={"none"}
            initialInvoice={{}}
            suppliers={suppliers}
            cb={fetchInvoices}
          />
        )}

        {(action === "Edit" || action === "Delete") && !selectedInvoice && (
          <div className="h-[94vh] flex flex-col items-center">
            <div>
              Select Invoice: <input type="text" />
              <Popup
                items={invoices}
                onSelect={handleInvoiceSelect}
                style={{ top: "top-11 left-[895px]" }}
                columns={[
                  { key: "id", label: "Invoice No" },
                  { key: "supplierName", label: "Supplier Name" },
                ]}
                all={true}
              />
            </div>
          </div>
        )}

        {action === "Add" && (
          <PurchaseForm
            mode={"Add"}
            initialInvoice={{}}
            suppliers={suppliers}
            cb={fetchInvoices}
          />
        )}

        {(action === "Edit" || action === "Delete") && selectedInvoice && (
          <PurchaseForm
            mode={action}
            initialInvoice={selectedInvoice}
            suppliers={suppliers}
            cb={fetchInvoices}
          />
        )}
      </div>
    </div>
  );
}

const initialFormData = {
  supplierId: "",
  supplierName: "",
  products: [],
  invoiceNo: "",
  date: formatDate(new Date()),
};

export const PurchaseForm = ({
  initialInvoice,
  mode,
  fullHeight,
  suppliers,
  cb,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [isModeDelete, setIsModeDelete] = useState(mode === "Delete");

  useEffect(() => {
    setFormData({
      supplierId: initialInvoice.supplierId || "",
      supplierName: initialInvoice.supplierName || "",
      products: initialInvoice.products || [],
      invoiceNo: initialInvoice.id || "",
      date: initialInvoice.date ? initialInvoice.date : formatDate(new Date()),
    });
  }, [initialInvoice]);

  const handleSubmit = async (e) => {
    const { invoiceNo, ...invoice } = formData;
    e.preventDefault();
    if (mode === "Edit") {
      await updatePurchaseInvoice(invoiceNo, invoice);
      alert("Purchase Invoice edited");
    } else if (mode === "Add") {
      await addPurchaseInvoice(invoice);
      alert("Purchase Invoice added");
    } else if (mode === "Delete") {
      await deletePurchaseInvoice(invoiceNo);
      alert("Purchase Invoice deleted");
    }
    setFormData(initialFormData);
    if (cb) cb();
  };

  const handleSupplierSelect = (supplier) => {
    setFormData((prevData) => ({
      ...prevData,
      supplierName: supplier.name,
      supplierId: supplier.id,
    }));
  };

  const handleDataChange = (products) => {
    setFormData((prevData) => ({
      ...prevData,
      products: products,
    }));
  };

  const calculateTotalPrice = (products) => {
    if (!products) return 0;
    return products
      .reduce((total, product) => total + product.quantity * product.price, 0)
      .toFixed(2);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={` ${
        fullHeight ? "min-h-[99vh]" : "min-h-[88.4vh]"
      }     bg-background`}
    >
      <div
        className={`flex justify-around    ${
          fullHeight ? "" : "mt-10"
        }  border w-[70%] mx-auto`}
      >
        <div
          className={`flex items-center relative ${fullHeight ? "mt-20" : ""}`}
        >
          <span className="w-[40%] text-right inline-block">
            Supplier Name:
          </span>
          <input
            type="text"
            value={formData.supplierName}
            className={`h-7 px-1 border border-gray-600 ml-1 ${
              !isModeDelete && mode !== "none" ? "bg-white" : ""
            }`}
            disabled={isModeDelete || mode === "none"}
            readOnly
          />
          {!isModeDelete && mode !== "none" && (
            <Popup
              items={suppliers}
              onSelect={handleSupplierSelect}
              style={{ top: "top-1 left-[284px]" }}
              columns={[
                { key: "id", label: "Supplier ID" },
                { key: "name", label: "Supplier Name" },
              ]}
              all={true}
            />
          )}
        </div>

        <div
          className={`flex items-center relative ${fullHeight ? "mt-20" : ""}`}
        >
          <span className="w-[30%] text-right inline-block">Supplier Id:</span>
          <input
            type="text"
            value={formData.supplierId}
            className={`h-7 px-1 border border-gray-600 ml-1 ${
              !isModeDelete && mode !== "none" ? "bg-white" : ""
            }`}
            disabled={isModeDelete || mode === "none"}
            readOnly
          />
        </div>
        <div
          className={`flex items-center relative ${fullHeight ? "mt-20" : ""}`}
        >
          <div className="flex items-center">
            <span className="w-[50%] text-right inline-block">Date:</span>
            <input
              type="text"
              value={formData.date}
              className={`h-7 px-1 border border-gray-600 ml-1 ${
                !isModeDelete && mode !== "none" ? "bg-white" : ""
              }`}
              disabled
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <PurchaseInvoiceTable
          initialRows={initialInvoice.products}
          mode={mode}
          onDataChange={handleDataChange}
        />
      </div>

      <div className="flex ml-4 mt-5 items-center">
        <span className="text-right inline-block">Total Price:</span>
        <input
          type="text"
          value={calculateTotalPrice(formData.products)}
          className="h-7 px-1 bg-white border border-gray-600 ml-1"
          disabled
        />
      </div>

      {mode !== "none" && (
        <button
          type="submit"
          className="w-full mt-5 py-1 bg-white border-gray-300"
        >
          {mode} Invoice
        </button>
      )}
    </form>
  );
};

export default PurchaseInvoice;
