import React, { useEffect, useState } from "react";
import Popup from "../Components/Popup";
import Table from "../Components/Table";
import { getAllAreas } from "../../db/area";
import {
  addCustomer,
  deleteCustomer,
  getAllCustomers,
  updateCustomer,
} from "../../db/customers";
import { vat } from "./ProductMastery";

/**
 * @typedef {import('../../db/area').Area} Area
 * @typedef {import('../../db/customers').Customer} Customer
 */

function CustomerMastery() {
  const [action, setAction] = useState("none");
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  /**
   * @type {[Area[], Function]}
   */
  const [areas, setAreas] = useState([]);
  /**
   * @type {[Customer[], Function]}
   */
  const [customers, setCustomers] = useState([]);

  const fetchAreas = async () => {
    const data = await getAllAreas();
    setAreas(data);
  };
  const fetchCustomers = async () => {
    const data = await getAllCustomers();
    setCustomers(data);
  };

  useEffect(() => {
    fetchAreas();
    fetchCustomers();
  }, []);

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleActionChange = (newAction) => {
    setAction(newAction);
    setSelectedSupplier(null);
  };

  return (
    <div>
      <div className="w-[98%] mx-auto">
        <nav className="flex gap-1">
          <button
            onClick={() => handleActionChange("add")}
            className="bg-gray-100 px-5 py-1 active:scale-95 border border-gray-300 mt-2"
          >
            Add
          </button>
          <button
            onClick={() => handleActionChange("edit")}
            className="bg-gray-100 px-5 py-1 active:scale-95 border border-gray-300 mt-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleActionChange("delete")}
            className="bg-gray-100 px-5 py-1 active:scale-95 border border-gray-300 mt-2"
          >
            Delete
          </button>
        </nav>

        {action === "none" && (
          <CustomerForm
            areas={areas}
            mode={"delete"}
            initialSupplier={{}}
            cb={fetchCustomers}
            customers={customers}
          />
        )}

        {(action === "edit" || action === "delete") && !selectedSupplier && (
          <div className="h-[94vh] flex flex-col items-center">
            <div>
              Select Supplier: <input type="text" />
              <Popup
                items={customers}
                onSelect={(item) => handleSupplierSelect(item)}
                style={{ top: "top-11 left-[56%]" }}
                columns={[
                  { key: "name", label: "Supplier Name" },
                  { key: "address", label: "Address" },
                  { key: "mobile", label: "Mobile" },
                ]}
                all={true}
              />
            </div>
          </div>
        )}

        {action === "add" && (
          <CustomerForm
            mode={"add"}
            areas={areas}
            initialSupplier={{}}
            cb={fetchCustomers}
            customers={customers}
          />
        )}

        {(action === "edit" || action === "delete") && selectedSupplier && (
          <CustomerForm
            areas={areas}
            mode={action}
            initialSupplier={selectedSupplier}
            cb={fetchCustomers}
          />
        )}
      </div>
    </div>
  );
}

const initialCustomerData = {
  id: "",
  name: "",
  accountType: "Customer",
  referenceId: "",
  createdOn: new Date().toISOString().split("T")[0],
  supplierName: "",
  area: "",
  deliveryPlace: "",
  creditLimit: "",
  address: "",
  telephone: "",
  mobile: "",
  email: "",
  salId: "",
  vatCode: "",
  tmId: "",
  legalName: "",
  active: "Yes",
};

function CustomerForm({ mode, initialSupplier, areas, cb, customers }) {
  const [formData, setFormData] = useState(initialCustomerData);

  useEffect(() => {
    setFormData({
      id: initialSupplier.id || "",
      name: initialSupplier.name || "",
      accountType: initialSupplier.accountType || "Customer",
      referenceId: initialSupplier.referenceId || "",
      createdOn:
        initialSupplier.createdOn || new Date().toISOString().split("T")[0],
      supplierName: initialSupplier.supplierName || "",
      area: initialSupplier.area || "",
      deliveryPlace: initialSupplier.deliveryPlace || "",
      creditLimit: initialSupplier.creditLimit || "",
      address: initialSupplier.address || "",
      telephone: initialSupplier.telephone || "",
      mobile: initialSupplier.mobile || "",
      email: initialSupplier.email || "",
      description: initialSupplier.description || "",
      salId: initialSupplier.salId || "",
      vatCode: initialSupplier.vatCode || "",
      tmId: initialSupplier.tmId || "",
      legalName: initialSupplier.legalName || "",
      active: initialSupplier.active || "Yes",
    });
  }, [initialSupplier]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleAreaChange = (area) => {
    setFormData((prevData) => ({
      ...prevData,
      area: area.name,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { id, ...customerWithoutId } = formData;
    if (mode === "add") {
      const custId = await addCustomer(customerWithoutId);
      if (custId) alert("Customer added sucessfully");
      else alert("Failed to add customer");
    } else if (mode === "edit") {
      await updateCustomer(id, customerWithoutId);
      alert("Customer Updated Sucessfully");
    } else if (mode === "delete") {
      await deleteCustomer(id);
      alert("Customer Deleted Sucessfully");
    }
    if (cb) cb();
    setFormData(initialCustomerData);
  };
  const handleVatTypeSelect = (VatType) => {
    setFormData((prevData) => ({
      ...prevData,
      vatCode: VatType || "",
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-[88.5vh]">
      <div className="w-[96%] mx-auto grid grid-cols-9 gap-3 p-2 mt-10">
        {/* Branch */}
        <div className="flex items-center col-span-1">
          <span className="w-[74%] text-right inline-block">Branch:</span>
          <input
            type="text"
            name="branch"
            value={1}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled
          />
        </div>

        {/* Branch Name */}
        <div className="flex items-center col-span-2">
          <input
            type="text"
            name="branchName"
            value={"Main Branch"}
            // onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled
          />
        </div>

        {/* Account Type */}
        <div className="flex items-center col-span-2 border ">
          <span className="w-[60%] text-right inline-block">Acc.Type:</span>
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          >
            <option value="Customer">Customer</option>
            <option value="Supplier">Supplier</option>
          </select>
        </div>

        {/* Reference ID */}
        <div className="flex items-center col-span-2">
          <span className="w-[50%] text-right inline-block">Reference ID:</span>
          <input
            type="text"
            name="referenceId"
            value={formData.referenceId}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          />
        </div>

        {/* Created On */}
        <div className="flex items-center col-span-2">
          <span className="w-[40%] text-right inline-block">Date:</span>
          <input
            type="date"
            name="createdOn"
            value={formData.createdOn}
            onChange={handleInputChange}
            className="h-7 w-full px-1 border border-gray-600  ml-1"
            disabled
          />
        </div>

        {/* Supplier Name */}
        <div className="flex items-center col-span-3">
          <span className="w-[14.5%] text-right inline-block">Name:</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          />
        </div>

        {/* Area */}
        <div className="flex items-center col-span-2 relative">
          <span className="w-[60%] text-right inline-block">Area:</span>
          <input
            type="text"
            name="area"
            value={formData.area}
            className={`h-7 px-1 border border-gray-600  w-full ml-1   ${
              !(mode === "delete") && "bg-white"
            } `}
            disabled
          />
          {!(mode === "delete") && (
            <Popup
              items={areas}
              onSelect={handleAreaChange}
              style={{ top: "top-[25%] left-[94%] " }}
              columns={[
                { key: "name", label: "Area Name" },
                { key: "shortForm", label: "Short Form" },
              ]}
              all={true}
            />
          )}
        </div>

        {/* Delivery Place */}
        <div className="flex items-center col-span-2">
          <span className="w-[50%] text-right inline-block">Del.Place:</span>
          <input
            type="text"
            name="deliveryPlace"
            value={formData.deliveryPlace}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          />
        </div>

        {/* Credit Limit */}
        <div className="flex items-center col-span-2">
          <span className="w-[40%] text-right inline-block">Credit Limit:</span>
          <input
            type="text"
            name="creditLimit"
            value={formData.creditLimit}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          />
        </div>

        {/* Address */}
        <div className="flex items-center col-span-3">
          <span className="w-[14%] text-right inline-block">Address:</span>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          />
        </div>

        {/* Telephone */}
        <div className="flex items-center col-span-2">
          <span className="w-[60%] text-right inline-block">Tel.No:</span>
          <input
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          />
        </div>

        {/* Mobile */}
        <div className="flex items-center col-span-2">
          <span className="w-[50%] text-right inline-block">Mob:</span>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          />
        </div>
        {/* sal ID */}
        <div className="flex items-center col-span-2">
          <span className="w-[40%] text-right inline-block">Sal.Id:</span>
          <input
            type="text"
            name="salId"
            value={formData.salId}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          />
        </div>

        {/* Email */}
        <div className="flex items-center col-span-3">
          <span className="w-[15%] text-right inline-block">Email:</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          />
        </div>
        {/* Active */}
        <div className="flex items-center col-span-2">
          <span className="w-[60%] text-right inline-block">Active:</span>
          <select
            name="active"
            value={formData.active}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* VAT Type */}
        <div className=" relative flex items-center col-span-2 ">
          <span className="w-[33%]   text-right inline-block">Vat type:</span>
          <input
            type="text"
            name="vatType"
            value={formData.vatCode}
            disabled
            className={` ${
              mode == "edit" || mode == "add" ? "bg-white" : ""
            } flex-1 h-7      px-1 border  border-gray-600 ml-1 `}
          />
          {!(mode === "delete") && (
            <Popup
              items={vat}
              onSelect={handleVatTypeSelect}
              style={{ top: "top-1 left-[92%]" }}
              columns={[
                { key: "shortForm", label: "VAT Code" },
                { key: "Description", label: "Description" },
                { key: "Vatpercentage", label: "VAT Percentage" },
                { key: "startDate", label: "Start Date" },
              ]}
            />
          )}
        </div>

        {/* TmID */}
        <div className="flex items-center col-span-2">
          <span className="w-[40%] text-right inline-block">TmID:</span>
          <input
            type="text"
            name="tmId"
            value={formData.tmId}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          />
        </div>

        {/* Legal Name */}
        <div className="flex items-center col-span-3">
          <span className="w-[30%]   inline-block">Legal Name:</span>
          <input
            type="text"
            name="legalName"
            value={formData.legalName}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full"
            disabled={mode === "delete"}
          />
        </div>
      </div>

      <div className=" mt-7 min-h-[40vh]">
        <Table
          data={mode === "add" ? customers : [formData]}
          name={"Details"}
          columns={[
            { key: "id", header: "Id" },
            { key: "name", header: "Name" },
            { key: "accountType", header: "Account Type" },
            { key: "referenceId", header: "Reference ID" },
            { key: "createdOn", header: "Date" },
            { key: "area", header: "Area" },
            { key: "deliveryPlace", header: "Delivery Place" },
            { key: "creditLimit", header: "Credit Limit" },
            { key: "address", header: "Address" },
            { key: "telephone", header: "Telephone Number" },
            { key: "mobile", header: "Mobile Number" },
            { key: "salId", header: "Sales ID" },
            { key: "email", header: "Email" },
            { key: "active", header: "Active?" },
            { key: "vatCode", header: "VAT Code" },
            { key: "tmId", header: "Tm ID" },
            { key: "legalName", header: "Legal Name" },
          ]}
          highlightColumn={"Id"}
          height={40}
        />
      </div>

      <div className="mt-2">
        {(mode === "add" || mode === "edit") && (
          <button type="submit" className=" px-5 py-1   bg-white w-full  ">
            {mode === "add" ? "Add" : "Update"} Customer
          </button>
        )}
        {mode === "delete" && Object.keys(initialSupplier).length != 0 && (
          <button type="submit" className=" px-5 py-1  bg-white w-full  ">
            Delete Customer
          </button>
        )}
      </div>
    </form>
  );
}

export default CustomerMastery;
