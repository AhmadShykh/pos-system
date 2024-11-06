import React, { useEffect, useState } from "react";
import MachineProductSelector from "./MachineProductSearch";
import Popup from "./Popup";
import {
  getAllQuotations,
} from "../../db/quotation";
import { getAllAreas } from "../../db/area";
import { getCustomers } from "../../db/customers";
import CashInvoiceTable from "./CashInvoiceTable";
//import { CashInvoiceForm } from "../Pages/CashInvoice";

export function QoutationTable2({ formData, onDataChange, Rows, mode }) {
  const [rows, setRows] = useState([]);
  const [nextSiNo, setNextSiNo] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [quotation, setQuotation] = useState([]);
  const [areas, setAreas] = useState([]);
  const [customers, setCustomers] = useState([]);


  const fetchInvoices = async () => {

    const quotation = await getAllQuotations();
    setQuotation(quotation);
  };

  useEffect(() => {
    const fetchData = async () => {
      const areas = await getAllAreas();
      setAreas(areas);
      const customers = await getCustomers();
      setCustomers(customers);
    };
    fetchInvoices();
    fetchData();




  }, []);


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

  const handleInvoiceSelect = (invoice) => {
    // Normalize the type to lowercase for consistent comparison
    const normalizedInvoice = {
      ...invoice,
      type: invoice.type?.toLowerCase() || null,
      status: invoice.status?.toLowerCase() || "unpaid",
    };

    //
    // setSelectedInvoice(normalizedInvoice);
    // setEditField(false);
    // setIsPaid(normalizedInvoice.status === "paid");
    //
    // // Log for debugging
    // console.log("Selected Invoice:", normalizedInvoice);
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
              <MachineProductSelector onProductSelect={handleProductSelect}/>
            </div>
          </div>
      )}
    </div>
  );
}


export default function QoutationTable({formData, onDataChange, Rows, mode}) {
  const [rows, setRows] = useState([]);
  const [nextSiNo, setNextSiNo] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [invoiceType, setInvoiceType] = useState("Quotation");
  const [quotation, setQuotation] = useState([]);
  const [areas, setAreas] = useState([]);
  const [customers, setCustomers] = useState([]);


  const docTypeData = [
    {
      shortForm: "Cash",
      name: "Cash Invoice",
    },
    {
      shortForm: "Delivery",
      name: "Delivery Note",
    },
    {
      shortForm: "Quotation",
      name: "Quotation",
    },
  ];
  const sManData = [
    {
      name: "Salesman 1",
    },
    {
      name: "Salesman 2",
    },
    {
      name: "Salesman 3",
    },
    {
      name: "Salesman 4",
    },
  ];


  const paymentData = [
    {
      name: "Cash",
    },
    {
      name: "Credit Card",
    },
    {
      name: "Both",
    },
  ];

  const typeData = [
    {
      name: "Local",
    },
    {
      name: "International",
    },
  ];


  const [formFields, setFormFields] = useState({
    terms: "",
    LOC: "",
    DocNo: "",
    date: new Date().toISOString().split('T')[0],
    accCode: "",
    accountName: "",
    refNo: "",
    curr: "",
    rate: 1,
    docType: "",
    note: "",
    docNo1: "",
    sMan: "",
    MDoc: "",
    payment: "",
    delPlace: "",
    area: "",
    PONo: "",
    type: "",
  });

  const fetchInvoices = async () => {

    const quotation = await getAllQuotations();
    setQuotation(quotation);
  };

  useEffect(() => {
    const fetchData = async () => {
      const areas = await getAllAreas();
      setAreas(areas);
      const customers = await getCustomers();
      setCustomers(customers);
    };
    fetchInvoices();
    fetchData();




  }, []);


  const currencyData = [
    {
      shortForm: "UAE",
      name: "Dirham",
    },
    {
      shortForm: "USD",
      name: "American Dollar",
    },
  ];

  const handleInvoiceSelect = (invoice) => {
    // Normalize the type to lowercase for consistent comparison
    const normalizedInvoice = {
      ...invoice,
      type: invoice.type?.toLowerCase() || null,
      status: invoice.status?.toLowerCase() || "unpaid",
    };

    //
    // setSelectedInvoice(normalizedInvoice);
    // setEditField(false);
    // setIsPaid(normalizedInvoice.status === "paid");
    //
    // // Log for debugging
    // console.log("Selected Invoice:", normalizedInvoice);
  };

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

  const handleInputChange = (e) => {
    console.log(e);
    const { name, value } = e.target; // Access name and value from e.target
    setFormFields(prev => ({
      ...prev,
      [name]: value
    }));
  };


  //handling poopup inputs
  const handleAccountNameSelect = (accountName) => {
    setFormFields((prevData) => ({
      ...prevData,
      accountName: accountName,
    }));
  };
  const handleCurrencyChange = (currency) => {
    setFormFields((prevData) => ({
      ...prevData,
      curr: currency,
    }));
  };
  const handleDocTypeChange = (docType) => {
    setFormFields((prevData) => ({
      ...prevData,
      docType: docType, // !redundant after new requirement
    }));
    setInvoiceType(docType);
  };
  const handleSManChange = (sMan) => {
    setFormFields((prevData) => ({
      ...prevData,
      sMan: sMan,
    }));
  };
  const handlePaymentChange = (payment) => {
    setFormFields((prevData) => ({
      ...prevData,
      payment: payment,
    }));
  };
  const handleAreaChange = (area) => {
    setFormFields((prevData) => ({
      ...prevData,
      area: area.name,
    }));
  };
  const handleTypeDataChange = (type) => {
    setFormFields((prevData) => ({
      ...prevData,
      type: type,
    }));
  };

  const handleDeleteRow = (index) => {
    const newRows = rows.filter((row, i) => i !== index);
    setRows(newRows);
    onDataChange(newRows);
  };

  const handleRowInputChange = (index, field, value) => {
    const newRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(newRows);
    onDataChange(newRows);
  };




  return (
      <div className="mt-10 mb-10 min-h-[10vh] w-[98%] mx-auto">
        {/* Form Fields Grid */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          {/* Terms */}
          <div className="flex items-center col-span-1">
            <span className="w-[35%] text-right inline-block">Terms:</span>
            <input
                type="text"
                name="terms"
                value={formFields.terms}
                onChange={handleInputChange}
                className="h-7 px-1 border border-gray-600 w-full ml-1"
                disabled={mode === "delete"}
            />
          </div>

          {/* Branch */}
          <div className="flex items-center col-span-1">
            <span className="w-[50%] text-right inline-block">Branch:</span>
            <input
                type="text"
                name="branch"
                value={2}
                className="h-7 px-1 border border-gray-600 w-full ml-1"
                disabled
            />
          </div>

          {/* Name */}
          <div className="flex items-center col-span-2">
            <span className="w-[13%] text-right inline-block">Name:</span>
            <input
                type="text"
                name="name"
                value="Main Branch"
                className="h-7 px-1 border border-gray-600 w-full ml-1"
                disabled
            />
          </div>

          {/* LOC */}
          <div className="flex items-center col-span-1">
            <span className="w-[40%] text-right inline-block">LOC:</span>
            <input
                type="text"
                name="LOC"
                value={formFields.LOC}
                onChange={handleInputChange}
                className="h-7 px-1 border border-gray-600 w-full ml-1"
                disabled={mode === "delete"}
            />
          </div>

          {/* Doc.No */}
          <div className="flex items-center col-span-1">
            <span className="w-[40%] text-right inline-block">Doc.No:</span>
            <input
                type="number"
                name="DocNo"
                value={formFields.DocNo}
                onChange={handleInputChange}
                className="h-7 px-1 border border-gray-600 w-full ml-1"
                disabled={mode === "delete"}
            />
          </div>

          {/* Date */}
          <div className="flex items-center col-span-1">
            <span className="w-[30%] text-right inline-block">Date:</span>
            <input
                type="text"
                name="date"
                value={formFields.date}
                onChange={handleInputChange}
                className="h-7 px-1 border border-gray-600 w-full ml-1"
                disabled={mode === "delete"}
            />
          </div>

          {/* Account Code */}
          <div className="flex items-center col-span-1">
            <span className="w-[36%] text-right inline-block">Acc.Code:</span>
            <input
                type="text"
                name="accCode"
                value={formFields.accCode}
                onChange={handleInputChange}
                className="h-7 px-1 border border-gray-600 w-full ml-1"
                disabled={mode === "delete"}
            />
          </div>

          {/* Account Name */}
          <div className="flex items-center col-span-2 relative">
            <span className="w-[13%] text-right inline-block">Name:</span>
            <input
                type="text"
                value={formFields.accountName}
                onChange={handleInputChange}
                className={`h-7 px-1 border border-gray-600  w-full ml-1  ${
                    mode != "delete" ? "bg-white" : ""
                } `}
                disabled
            />
            {(
                <Popup
                    items={customers}
                    onSelect={handleAccountNameSelect}
                    style={{top: "top-1 left-[95%]"}}
                    columns={[
                      {key: "name", label: "Name"},
                      {key: "address", label: "Address"},
                      {key: "mobile", label: "Mobile"},
                      {key: "email", label: "Email"},
                      {key: "description", label: "Description"},
                      {key: "SAL", label: "SAL#"},
                      {key: "area", label: "Area"},
                      {key: "vatCode", label: "VAT code"},
                      {key: "TmId", label: "TmID"},
                    ]}
                />
            )}
          </div>


          {/* Reference Number */}
          <div className="flex items-center col-span-1">
            <span className="w-[40%] text-right inline-block">Ref No:</span>
            <input
                type="text"
                name="refNo"
                value={formFields.refNo}
                onChange={handleInputChange}
                className="h-7 px-1 border border-gray-600 w-full ml-1"
                disabled={mode === "delete"}
            />
          </div>

          {/* Currency */}
          {/* Curr */}
          <div className="flex items-center col-span-1 relative">
            <span className="w-[40%] text-right inline-block">Curr:</span>
            <input
                type="text"
                name="curr"
                value={formFields.curr}
                className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
                    mode != "delete" ? "bg-white" : ""
                }    `}
                disabled
            />
            {(
                <Popup
                    items={currencyData}
                    onSelect={handleCurrencyChange}
                    style={{top: "top-1 left-[93%]"}}
                    columns={[
                      {key: "shortForm", label: "Short Form"},
                      {key: "name", label: "Name"},
                    ]}
                />
            )}
          </div>


          {/* Rate */}
          <div className="flex items-center col-span-1">
            <span className="w-[30%] text-right inline-block">Rate:</span>
            <input
                type="text"
                name="rate"
                value={formFields.rate}
                onChange={handleInputChange}
                className="h-7 px-1 border border-gray-600 w-full ml-1"
                disabled={mode === "delete"}
            />
          </div>

          {/* Doc Type */}
          <div className="flex relative items-center col-span-1">
          <span className="w-[48%] text-right inline-block text-nowrap">
            Doc Type:
          </span>
            <input
                type="text"
                name="Invoice Type"
                value={formFields.docType}
                onChange={handleInputChange}
                className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
                    mode != "delete" ? "bg-white" : ""
                }`}
                disabled
            />

            {(
                <Popup
                    items={docTypeData}
                    onSelect={handleDocTypeChange}
                    style={{top: "top-1 left-[92%]"}}
                    columns={[
                      {key: "shortForm", label: "Type"},
                      {key: "name", label: "Name"},
                    ]}
                />
            )}
          </div>


          {/* Note */}
          <div className="flex items-center col-span-2">
            <span className="w-[13%] text-right inline-block">Note:</span>
            <input
                type="text"
                name="note"
                value={formFields.note}
                onChange={handleInputChange}
                className="h-7 px-1 border border-gray-600 w-full ml-1"
                disabled={mode === "delete"}
            />
          </div>

          {/* S.Man */}
          <div className="flex relative items-center col-span-1">
            <span className="w-[48%] text-right inline-block">S.Man:</span>
            <input
                type="text"
                name="sMan"
                value={formFields.sMan}
                className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
                    mode != "delete" ? "bg-white" : ""
                }`}
                disabled
            />

            {(
                <Popup
                    items={sManData}
                    onSelect={handleSManChange}
                    style={{top: "top-1 left-[93%]"}}
                    columns={[{key: "name", label: "Name"}]}
                />
            )}
          </div>


          {/* MDoc */}
          <div className="flex items-center col-span-1">
            <span className="w-[30%] text-right inline-block">MDoc:</span>
            <input
                type="number"
                name="MDoc"
                value={formFields.MDoc}
                onChange={handleInputChange}
                className="h-7 px-1 border border-gray-600 w-full ml-1"
                disabled={mode === "delete"}
            />
          </div>

          {/* Payment */}
          <div className="flex relative items-center col-span-1">
            <span className="w-[48%] text-right inline-block">Payment:</span>
            <input
                type="text"
                name="payment"
                value={formFields.payment}
                className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
                    mode != "delete" ? "bg-white" : ""
                }`}
                disabled
            />
            {(
                <Popup
                    items={paymentData}
                    onSelect={handlePaymentChange}
                    style={{top: "top-1 left-[92%]"}}
                    columns={[{key: "name", label: "Mode of Payment"}]}
                />
            )}
          </div>


          {/* DelPlace */}
          <div className="flex items-center col-span-1">
            <span className="w-[28%] text-right inline-block">DelPlace:</span>
            <input
                type="text"
                name="delPlace"
                value={formFields.delPlace}
                onChange={handleInputChange}
                className="h-7 px-1 border border-gray-600 w-full ml-1"
                disabled={mode === "delete"}
            />
          </div>

          {/* Area */}
          <div className="flex relative items-center col-span-1">
            <span className="w-[48%] text-right inline-block">Area:</span>
            <input
                type="text"
                name="area"
                value={formFields.area}
                className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
                    mode != "delete" ? "bg-white" : ""
                }`}
                disabled
            />

            { (
                <Popup
                    items={areas}
                    onSelect={handleAreaChange}
                    style={{top: "top-1 left-[92%]"}}
                    columns={[
                      {key: "name", label: "Area Name"},
                      {key: "shortForm", label: "Area ShortForm"},
                    ]}
                    all={true}
                />
            )}
          </div>


          {/* PO No */}
          <div className="flex items-center col-span-1">
            <span className="w-[40%] text-right inline-block">PO No:</span>
            <input
                type="number"
                name="PONo"
                value={formFields.PONo}
                onChange={handleInputChange}
                className="h-7 px-1 border border-gray-600 w-full ml-1"
                disabled={mode === "delete"}
            />
          </div>

          {/* Type */}

          <div className="flex relative items-center col-span-1">
            <span className="w-[40%] text-right inline-block">Type:</span>
            <input
                type="text"
                name="type"
                value={formFields.type}
                className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
                    mode != "delete" ? "bg-white" : ""
                }`}
                disabled
            />
            {(
                <Popup
                    items={typeData}
                    onSelect={handleTypeDataChange}
                    style={{top: "top-1 left-[93%]"}}
                    columns={[{key: "name", label: "Name"}]}
                />
            )}
          </div>
        </div>

        {/* Products Table Section */}
        {
          <div>
            <CashInvoiceTable
                formData={formData}
                onDataChange={handleRowChange}
                Rows={initialInvoice.products}
                mode={"add"}
            />
          </div>
        }
        {/*<button*/}
        {/*    onClick={handleAddRow}*/}
        {/*    className="bg-white text-black border-gray-300 border px-6 py-2 mb-3 focus:scale-95"*/}
        {/*    type="button"*/}
        {/*>*/}
        {/*  Add Product*/}
        {/*</button>*/}

        {/*<div className="relative w-[274px]">*/}
        {/*  Select Quotation: <input type="text"/>*/}
        {/*  <Popup*/}
        {/*      items={quotation}*/}
        {/*      onSelect={handleInvoiceSelect}*/}
        {/*      style={{top: "top-[3px] left-[92%]"}}*/}
        {/*      columns={[*/}
        {/*        {key: "id", label: "Id"},*/}
        {/*        {key: "accountName", label: "Customer"},*/}
        {/*        {key: "DocNo", label: "DocNo"},*/}
        {/*        {key: "date", label: "Date"},*/}
        {/*        {key: "total", label: "Total"},*/}
        {/*      ]}*/}
        {/*      name={"invoiceList"}*/}
        {/*      all={true}*/}
        {/*      className = "mt-10"*/}
        {/*  />*/}
        {/*</div>*/}

        {/*<div className="min-h-[30vh] max-h-[30vh] overflow-auto bg-blue-100">*/}
        {/*  <table className="w-full border-collapse border border-gray-300 bg-blue-100">*/}
        {/*    <thead>*/}
        {/*    <tr className="bg-blue-900 text-white">*/}
        {/*      <th className="border border-gray-300 px-1 italic font-bold text-sm bg-yellow-100 text-black">*/}
        {/*        S.I No*/}
        {/*      </th>*/}
        {/*      <th className="border border-gray-300 px-1 font-normal text-sm">Type</th>*/}
        {/*      <th className="border border-gray-300 px-1 font-normal text-sm">Product Code</th>*/}
        {/*      <th className="border border-gray-300 px-1 font-normal text-sm">Brand</th>*/}
        {/*      <th className="border border-gray-300 px-1 font-normal text-sm">Description</th>*/}
        {/*      <th className="border border-gray-300 px-1 font-normal text-sm">Unit</th>*/}
        {/*      <th className="border border-gray-300 px-1 font-normal text-sm">Quantity</th>*/}
        {/*      <th className="border border-gray-300 px-1 font-normal text-sm">G. Amount</th>*/}
        {/*      <th className="border border-gray-300 px-1 font-normal text-sm">Discount %</th>*/}
        {/*      <th className="border border-gray-300 px-1 font-normal text-sm">Total VAT %</th>*/}
        {/*      <th className="border border-gray-300 px-1 font-normal text-sm">Actions</th>*/}
        {/*    </tr>*/}
        {/*    </thead>*/}
        {/*    <tbody>*/}
        {/*    {rows.map((row, index) => (*/}
        {/*        <tr key={row.siNo}>*/}
        {/*          <td className="border min-w-20 border-gray-300 text-center">*/}
        {/*            {row.siNo}*/}
        {/*          </td>*/}
        {/*          <td className="border border-gray-300 px-1">*/}
        {/*            <input*/}
        {/*                type="text"*/}
        {/*                value={row.type}*/}
        {/*                onChange={(e) => handleInputChange(index, "type", e.target.value)}*/}
        {/*                className="bg-transparent outline-none focus:bg-white w-full"*/}
        {/*                disabled={mode === "delete"}*/}
        {/*            />*/}
        {/*          </td>*/}
        {/*          <td className="border border-gray-300 px-1">*/}
        {/*            <input*/}
        {/*                type="text"*/}
        {/*                value={row.productCode}*/}
        {/*                onClick={() => handleOpenModal(index)}*/}
        {/*                readOnly*/}
        {/*                className="w-full bg-transparent outline-none cursor-pointer focus:bg-white"*/}
        {/*                disabled={mode === "delete"}*/}
        {/*            />*/}
        {/*          </td>*/}
        {/*          <td className="border border-gray-300 px-1">*/}
        {/*            <input*/}
        {/*                type="text"*/}
        {/*                value={row.brand}*/}
        {/*                onChange={(e) => handleInputChange(index, "brand", e.target.value)}*/}
        {/*                className="w-full bg-transparent outline-none focus:bg-white"*/}
        {/*                disabled={mode === "delete"}*/}
        {/*            />*/}
        {/*          </td>*/}
        {/*          <td className="border border-gray-300 px-1">*/}
        {/*            <input*/}
        {/*                type="text"*/}
        {/*                value={row.description}*/}
        {/*                onChange={(e) => handleInputChange(index, "description", e.target.value)}*/}
        {/*                className="w-full bg-transparent outline-none focus:bg-white"*/}
        {/*                disabled={mode === "delete"}*/}
        {/*            />*/}
        {/*          </td>*/}
        {/*          <td className="border border-gray-300 px-1">*/}
        {/*            <input*/}
        {/*                type="text"*/}
        {/*                value={row.unit}*/}
        {/*                onChange={(e) => handleInputChange(index, "unit", e.target.value)}*/}
        {/*                className="w-full bg-transparent outline-none focus:bg-white"*/}
        {/*                disabled={mode === "delete"}*/}
        {/*            />*/}
        {/*          </td>*/}
        {/*          <td className="border border-gray-300 px-1">*/}
        {/*            <input*/}
        {/*                type="number"*/}
        {/*                value={row.quantity}*/}
        {/*                min={0}*/}
        {/*                onChange={(e) => handleInputChange(index, "quantity", e.target.value)}*/}
        {/*                className="w-full bg-transparent outline-none focus:bg-white"*/}
        {/*                disabled={mode === "delete"}*/}
        {/*            />*/}
        {/*          </td>*/}
        {/*          <td className="border border-gray-300 px-1">*/}
        {/*            <input*/}
        {/*                type="number"*/}
        {/*                value={row.gAmount}*/}
        {/*                min={0}*/}
        {/*                onChange={(e) => handleInputChange(index, "gAmount", e.target.value)}*/}
        {/*                className="w-full bg-transparent outline-none focus:bg-white"*/}
        {/*                disabled={mode === "delete"}*/}
        {/*            />*/}
        {/*          </td>*/}
        {/*          <td className="border border-gray-300 px-1">*/}
        {/*            <input*/}
        {/*                type="number"*/}
        {/*                value={row.discount}*/}
        {/*                min={0}*/}
        {/*                onChange={(e) => handleInputChange(index, "discount", e.target.value)}*/}
        {/*                className="w-full bg-transparent outline-none focus:bg-white"*/}
        {/*                disabled={mode === "delete"}*/}
        {/*            />*/}
        {/*          </td>*/}
        {/*          <td className="border border-gray-300 px-1">*/}
        {/*            <input*/}
        {/*                type="number"*/}
        {/*                value={row.totalVat}*/}
        {/*                min={0}*/}
        {/*                onChange={(e) => handleInputChange(index, "totalVat", e.target.value)}*/}
        {/*                className="w-full bg-transparent outline-none focus:bg-white"*/}
        {/*                disabled={mode === "delete"}*/}
        {/*            />*/}
        {/*          </td>*/}

        {/*          <td className="border border-gray-300 py-1 text-center px-1">*/}
        {/*            <button*/}
        {/*                onClick={() => handleDeleteRow(index)}*/}
        {/*                className="text-red-500"*/}
        {/*                type="button"*/}
        {/*            >*/}
        {/*              Delete*/}
        {/*            </button>*/}
        {/*          </td>*/}
        {/*        </tr>*/}
        {/*    ))}*/}
        {/*    </tbody>*/}
        {/*  </table>*/}
        {/*</div>*/}

        {/*{isModalOpen && (*/}
        {/*    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">*/}
        {/*      <div className="p-4 rounded shadow-lg max-w-[95vw] min-w-[95vw] bg-background">*/}
        {/*        <button*/}
        {/*            className="text-red-500 mb-2"*/}
        {/*            type="button"*/}
        {/*            onClick={handleCloseModal}*/}
        {/*        >*/}
        {/*          Close*/}
        {/*        </button>*/}
        {/*        <MachineProductSelector onProductSelect={handleProductSelect}/>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*)}*/}
      </div>
  );
}

// export default QoutationTable