import React, { useEffect, useState } from "react";

import { getAllAreas } from "../../db/area";
import {
  addCashInvoice,
  deleteCashInvoice,
  getAllCashInvoices,
  updateCashInvoice,
} from "../../db/cashInvoice";
import { getCustomers } from "../../db/customers";
import {
  addDeliveryNote,
  deleteDeliveryNote,
  getAllDeliveryNote,
  updateDeliveryNote,
} from "../../db/deliveryNote";
import {
  addQuotation,
  deleteQuotation,
  getAllQuotations,
  updateQuotation,
} from "../../db/quotation";
import CashInvoiceTable from "../Components/CashInvoiceTable";
import Popup from "../Components/Popup";
import QuotationTable from "../Components/QoutationTable";
import { QoutationTable2 } from "../Components/QoutationTable";
import PaymentFields from "../Components/PaymentFields";

/**
 * @typedef {import('../../db/cashInvoice').CashInvoice} CashInvoice
 * @typedef {import('../../db/area').Area} Area
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


/**
 * @type {Object} props
 * @params {string} props.mode
 * @params {CashInvoice} props.initialInvoice
 */
function CashInvoice({ mode, initialInvoice }) {
  // State to track the selected action
  const [state, setState] = useState("unPaid");
  const [action, setAction] = useState(mode || "none");
  const [selectedInvoice, setSelectedInvoice] = useState(
    initialInvoice || null
  );
  const [showEditField, setEditField] = useState(false);
  const [areas, setAreas] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [quotation, setQuotation] = useState([]);
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [isPaid, setIsPaid] = useState(false); // State for button color change
  const [showQuotationTable, setShowQuotationTable] = useState(false);

  const fetchInvoices = async () => {
    const invoices = await getAllCashInvoices();
    setInvoices(invoices);
    const deliveryNotes = await getAllDeliveryNote();
    setDeliveryNote(deliveryNotes);
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

  // const handleInvoiceSelect = (invoice) => {
  //   setSelectedInvoice(invoice);
  //   setEditField(false);
  //   setIsPaid(invoice.status === "paid"); // Check if already paid
  // };



  // const handleInvoiceSelect = (invoice) => {
  //   // Normalize the type to lowercase for consistent comparison
  //   const normalizedInvoice = {
  //     ...invoice,
  //     type: invoice.type?.toLowerCase() || null,
  //     status: invoice.status?.toLowerCase() || "unpaid",
  //   };
  //
  //
  //   setSelectedInvoice(normalizedInvoice);
  //   setEditField(false);
  //   setIsPaid(normalizedInvoice.status === "paid");
  //
  //   // Log for debugging
  //   console.log("Selected Invoice:", normalizedInvoice);
  // };

  const handleInvoiceSelect = (invoice) => {
    // Normalize the type to lowercase for consistent comparison
    const normalizedInvoice = {
      ...invoice,
      type: invoice.type?.toLowerCase() || null,
      status: invoice.status?.toLowerCase() || "unpaid",
    };


    setSelectedInvoice(normalizedInvoice);
    setEditField(false);
    setIsPaid(normalizedInvoice.status === "paid");

    // Log for debugging
    console.log("Selected Invoice:", normalizedInvoice);
  };


  const handleActionChange = (newAction) => {
    setAction(newAction);
    setSelectedInvoice(null);
    setEditField(newAction === "edit");
  };

  // Function to change invoice status from unpaid to paid
  // const handleChangeStatus = async () => {
  //   console.log(selectedInvoice)
  //   console.log(selectedInvoice.typetype)

  //   if (
  //     selectedInvoice &&
  //     (selectedInvoice.type === "Delivery" ||
  //       selectedInvoice.type === "delivery")
  //   ) {
  //     // Simulate changing the status on the frontend
  //     setSelectedInvoice((prev) => ({
  //       ...prev,
  //       status: "paid",
  //     }));
  //     setIsPaid(true); // Update button state

  //     // Uncomment the following lines when you're ready to implement the backend integration
  //     /*
  //     try {
  //       await updateCashInvoice(selectedInvoice.id, { status: "paid" });
  //     } catch (error) {
  //       console.error("Error updating invoice status:", error);
  //     }
  //     */
  //   }
  // };

  const handleChangeStatus = async () => {
    if (!selectedInvoice) return;

    const normalizedType = selectedInvoice.invoiceType?.toLowerCase();
    console.log("Invoice type:", normalizedType);

    if (normalizedType === "delivery") {
      try {
        // Update local state
        setSelectedInvoice((prev) => ({
          ...prev,
          status: "paid",
        }));
        setIsPaid(true);

        // Update in database
        await updateDeliveryNote(selectedInvoice.id, {
          ...selectedInvoice,
          status: "paid",
        });

        // Refresh the invoices list
        await fetchInvoices();

        alert("Invoice marked as paid successfully");
      } catch (error) {
        console.error("Error updating invoice status:", error);
        alert("Error updating invoice status");
      }
    }
  };

  const toggleQuotationManagement = () => {
    setShowQuotationTable((prev) => !prev);
    if(!showQuotationTable){
      setAction("add");
    }
  };
  return (
    <div>

      <div className="w-[98%] mx-auto">
        <nav className="flex gap-1">
          {!showQuotationTable && (
            <>
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
            </>
          )}
          <button
            onClick={toggleQuotationManagement}
            className="bg-gray-100 px-5 py-1 active:scale-95 border border-gray-300 mt-2"
          >

            {showQuotationTable
              ? "Hide Quotation Table"
              : "Show Quotation Table"}
          </button>
        </nav>



        { (
            <>
              {action === "none" && (
                  <CashInvoiceForm
                      mode={"delete"}
                      initialInvoice={{}}
                      areas={areas}
                      customers={customers}
                      cb={fetchInvoices}
                  />
              )}

              {(action === "edit" || action === "delete") && !selectedInvoice && (
                  <div className="h-[94vh] w-[85%] mx-auto mt-6 flex justify-between">
                    <div className="relative">
                      Select Invoice: <input type="text"/>
                      <Popup
                          items={invoices}
                          onSelect={handleInvoiceSelect}
                          style={{top: "top-[3px] left-[92%]" }}
                    columns={[
                      { key: "id", label: "Id" },
                      { key: "accountName", label: "Customer" },
                      { key: "DocNo", label: "DocNo" },
                      { key: "date", label: "Date" },
                      { key: "total", label: "Total" },
                    ]}
                    name={"invoiceList"}
                    all={true}
                  />
                </div>
                <div className="relative">
                  Select Quotation: <input type="text" />
                  <Popup
                    items={quotation}
                    onSelect={handleInvoiceSelect}
                    style={{ top: "top-[3px] left-[92%]" }}
                    columns={[
                      { key: "id", label: "Id" },
                      { key: "accountName", label: "Customer" },
                      { key: "DocNo", label: "DocNo" },
                      { key: "date", label: "Date" },
                      { key: "total", label: "Total" },
                    ]}
                    name={"invoiceList"}
                    all={true}
                  />
                </div>
                <div className="relative">
                  Select Delivery Note: <input type="text" />
                  <Popup
                    items={deliveryNote}
                    onSelect={handleInvoiceSelect}
                    style={{ top: "top-[3px] left-[92%]" }}
                    columns={[
                      { key: "id", label: "Id" },
                      { key: "accountName", label: "Customer" },
                      { key: "DocNo", label: "DocNo" },
                      { key: "date", label: "Date" },
                      { key: "total", label: "Total" },
                    ]}
                    name={"invoiceList"}
                    all={true}
                  />
                </div>
              </div>
            )}

            {action === "add" && (
              <CashInvoiceForm
                mode={"add"}
                initialInvoice={{
                  terms: "Cash",
                  branch: 2,
                  LOC: 2,
                  date: formatDate(new Date(Date.now())),
                }}
                areas={areas}
                customers={customers}
                cb={fetchInvoices}
                showQuotationTable = {showQuotationTable}
              />
            )}

            {(action === "edit" || action === "delete") && selectedInvoice && (
              <CashInvoiceForm
                mode={action}
                initialInvoice={selectedInvoice}
                areas={areas}
                customers={customers}
                cb={fetchInvoices}
              />
            )}

            {selectedInvoice &&
              (selectedInvoice.invoiceType === "Delivery" ||
                selectedInvoice.invoiceType === "delivery") && (
                <button
                  onClick={handleChangeStatus}
                  className={`mt-1 text-white px-4 py-2 w-full ${
                    isPaid ? "bg-gray-500" : "bg-blue-500"
                  }`}
                  disabled={selectedInvoice.status === "paid"}
                >
                  Mark as Paid
                </button>
              )}
          </>
        )}
      </div>
    </div>
  );
}

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

const initialFormData = {
  id: "",
  terms: "Cash",
  LOC: "",
  DocNo: "",
  date: new Date(Date.now()),
  accCode: "",
  accountName: "",
  refNo: "",
  curr: "",
  rate: "",
  docType: "",
  note: "",
  docNo1: "",
  sMan: "",
  MDoc: "",
  cashAmount:0,
  creditAmount:0,
  payment: "Cash",
  delPlace: "",
  area: "",
  type: "",
  PONo: "",
  total: 0,
  products: [],
};

const initialTotalDetails = {
  grossTotal: 0,
  discount: 0,
  disAmount: 0,
  vatAmount: 0,
  total: 0,
  netTotal: 0,
};

/**
 *
 * @param {Object} props
 * @param {string} props.mode
 * @param {CashInvoice} props.initialInvoice
 * @param {boolean} props.fullheight
 * @param {Area[]} props.areas
 * @param {Customer[]} props.customers
 * @param {Function} props.cb
 */
export function CashInvoiceForm({
  mode,
  initialInvoice,
  fullheight,
  areas,
  customers,
  cb,
  showQuotationTable,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [invoiceType, setInvoiceType] = useState("Cash");
  const [extraDiscount, setExtraDiscount] = useState(false);

  const [originalInvoiceType, setOriginalInvoiceType] = useState(
    initialInvoice.invoiceType || null
  );

  const [totalDetails, setTotalDetails] = useState(initialTotalDetails);
  const [paymentDetails, setPaymentDetails] = useState({
    cashAmount: 0,
    creditAmount: 0,
  });
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    const fetchQuotations = async () => {
      const data = await getAllQuotations();  // Assuming getAllQuotations is async
      setQuotations(data);
    };

    fetchQuotations();
  }, []);  // Empty dependency array means this will run only once when the component mounts



  const handleExtraDiscountChange = (value) =>{
    setExtraDiscount(value);
    totalDetails.extraDiscount = value;
    totalDetails.netTotal = (totalDetails.total - totalDetails.disAmount - value).toFixed(3);
  }
  //payments handling
  const handlePaymentDetailsChange = (details) => {
    setPaymentDetails(details);
    setFormData((prevData) => ({
      ...prevData,
      cashAmount: details.cashAmount,
      creditAmount: details.creditAmount,
    }));
  };

  //handling poopup inputs
  const handleAccountNameSelect = (accountName) => {
    setFormData((prevData) => ({
      ...prevData,
      accountName: accountName,
    }));
  };
  const handleCurrencyChange = (currency) => {
    setFormData((prevData) => ({
      ...prevData,
      curr: currency,
    }));
  };
  const handleDocTypeChange = (docType) => {
    setFormData((prevData) => ({
      ...prevData,
      docType: docType, // !redundant after new requirement
    }));
    setInvoiceType(docType);
  };
  const handleSManChange = (sMan) => {
    setFormData((prevData) => ({
      ...prevData,
      sMan: sMan,
    }));
  };
  const handlePaymentChange = (payment) => {
    setFormData((prevData) => ({
      ...prevData,
      payment: payment,
    }));
  };
  const handleAreaChange = (area) => {
    setFormData((prevData) => ({
      ...prevData,
      area: area.name,
    }));
  };
  const handleTypeDataChange = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      type: type,
    }));
  };
  /**
   *
   * @param {import("../../db/cashInvoice").InvoiceProduct[]} rows
   */
  const handleRowChange = (rows) => {
    let grossTotal = 0;
    let discount = 0; // percentage
    let disAmount = 0;
    let vatAmount = 0;
    let total = 0;
    let netTotal = 0;

    rows.forEach((row) => {
      // Ensure gAmount, totalVat, and discount are numbers
      const gAmount = Number(row.gAmount || 0) * row.quantity;
      const totalVat = Number(row.totalVat || 0);
      const discount = Number(row.discount || 0);

      // Calculate gross total
      grossTotal += gAmount;

      // Calculate tax and VAT amount
      let tax = Number(((gAmount * totalVat) / 100).toFixed(3));
      vatAmount += tax;

      // Calculate row total
      let rowTotal = Number((gAmount + tax).toFixed(3));

      // Calculate discount amount and total discount
      let discountAmount = Number(((rowTotal * discount) / 100).toFixed(3));
      disAmount += discountAmount;
    });

    discount = Number(((disAmount / grossTotal) * 100).toFixed(3));
    total = (grossTotal + vatAmount).toFixed(3);
    netTotal = (total - disAmount - extraDiscount).toFixed(3);
    console.log("Extra Discount: " + extraDiscount);
    console.log("netTotatl: " +netTotal);

    setTotalDetails({
      extraDiscount,
      grossTotal,
      discount,
      disAmount,
      vatAmount,
      total,
      netTotal,
    });
    setFormData((prevData) => ({
      ...prevData,
      products: rows,
    }));
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      id: initialInvoice.id || initialFormData.id,
      terms: initialInvoice.terms || initialFormData.terms,
      LOC: initialInvoice.LOC || initialFormData.LOC,
      DocNo: initialInvoice.DocNo || initialFormData.DocNo,
      date: initialInvoice.date || initialFormData.date,
      accCode: initialInvoice.accCode || initialFormData.accCode,
      accountName: initialInvoice.accountName || "",
      refNo: initialInvoice.refNo || initialFormData.refNo,
      curr: initialInvoice.curr || initialFormData.curr,
      rate: initialInvoice.rate | initialFormData.rate,
      docType: initialInvoice.docType | initialFormData.docType,
      note: initialInvoice.note || initialFormData.note,
      docNo1: initialInvoice.docNo1 || initialFormData.docNo1,
      sMan: initialInvoice.sMan || initialFormData.sMan,
      MDoc: initialInvoice.MDoc || initialFormData.MDoc,
      payment: initialInvoice.payment || initialFormData.payment,
      cashAmount: initialInvoice.cashAmount || initialFormData.cashAmount,
      creditAmount: initialInvoice.creditAmount || initialFormData.creditAmount,
      delPlace: initialInvoice.delPlace || initialFormData.delPlace,
      area: initialInvoice.area || initialFormData.area,
      PONo: initialInvoice.PONo || initialFormData.PONo,
      type: initialInvoice.type || initialFormData.type,
      products: initialInvoice.products || initialFormData.products,
      total: initialInvoice.total || initialFormData.total,
    }));
    setTotalDetails({
      grossTotal: initialInvoice.grossTotal || initialTotalDetails.grossTotal,
      discount: initialInvoice.discount || initialTotalDetails.discount,
      disAmount: initialInvoice.disAmount || initialTotalDetails.disAmount,
      vatAmount: initialInvoice.vatAmount || initialTotalDetails.vatAmount,
      total: initialInvoice.total || initialTotalDetails.total,
      netTotal: initialInvoice.netTotal || initialTotalDetails.netTotal,
    });
    setInvoiceType(initialInvoice.invoiceType || "Cash");
    setOriginalInvoiceType(initialInvoice.invoiceType || null);
  }, [initialInvoice]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, ...cashInvoice } = formData;
    if (mode === "add") {
      window.electron.ipcRenderer.send('open-invoice-window', { ...cashInvoice, ...totalDetails});
      if (invoiceType === "Cash") {
        await addCashInvoice({ ...cashInvoice, ...totalDetails, invoiceType });
        alert("Cash Invoice Created");
      } else if (invoiceType === "Delivery") {
        await addDeliveryNote({ ...cashInvoice, ...totalDetails, invoiceType });
        alert("Delivery Note Created");
      } else {
        await addQuotation({ ...cashInvoice, ...totalDetails, invoiceType });
        await addQuotation({ ...cashInvoice, ...totalDetails, invoiceType });
        alert("Quotation Created");
      }
    } else if (mode === "edit") {
      console.log(invoiceType + " " + originalInvoiceType);
      let isUpdated = true;
      if (originalInvoiceType === "Cash" && invoiceType === "Cash") {
        await updateCashInvoice(id, { ...cashInvoice, ...totalDetails });
      }
      if (originalInvoiceType === "Delivery" && invoiceType === "Delivery") {
        await updateDeliveryNote(id, { ...cashInvoice, ...totalDetails });
      }
      if (originalInvoiceType === "Quotation" && invoiceType === "Quotation") {
        await updateQuotation(id, { ...cashInvoice, ...totalDetails });
      } else if (
        originalInvoiceType === "Quotation" &&
        invoiceType === "Cash"
      ) {
        await addCashInvoice({ ...cashInvoice, ...totalDetails, invoiceType });
        await deleteQuotation(id);
      } else if (
        originalInvoiceType === "Quotation" &&
        invoiceType === "Delivery"
      ) {
        await addDeliveryNote({ ...cashInvoice, ...totalDetails, invoiceType });
        await deleteQuotation(id);
      } else {
        isUpdated = false;
        alert("Cannot change invoice type...");
      }
      if (isUpdated) alert("Updated Invoice");
    } else if (mode === "delete") {
      if (invoiceType === "Cash") {
        await deleteCashInvoice(id);
        alert("Cash Invoice deleted");
      } else if (invoiceType === "Delivery") {
        await deleteDeliveryNote(id);
        alert("Delivery Note deleted");
      } else if (invoiceType === "Quotation") {
        await deleteQuotation(id);
        alert("Quotation deleted");
      }
    }
    setFormData(initialFormData);
    setTotalDetails(initialTotalDetails);
    if (cb) cb();
  };
  const [isModeDelete, setIsModeDelete] = useState(mode === "delete");
  const roundDownTotal = (value) => {
    return Math.floor(value);
  };

  useEffect(() => {
    setTotalDetails((prevDetails) => ({
      ...prevDetails,
      total: roundDownTotal(totalDetails.total),
    }));
  }, [totalDetails.total]);


  const handleInvoiceSelect = (invoice) => {
    setFormData((formData) => ({
      ...formData,
      products: [
        ...formData.products,  // existing products
        ...invoice.products               // new products to append
      ]
    }));

    initialInvoice.products = formData.products;

  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${fullheight ? "min-h-[100vh]  " : "min-h-[92vh]"}`}
    >
      
      <div className="mx-auto">
        <div className="flex items-center w-[30%] mx-auto">
          <span className="w-[35%] text-right inline-block">Invoice Type:</span>
          <select
            name="invoiceType"
            value={invoiceType}
            onChange={(e) => setInvoiceType(e.target.value)}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          >
            <option value="Cash">Cash Invoice</option>
            <option value="Delivery">Delivery Note</option>
            <option value="Quotation">Quotation</option>
          </select>
        </div>
      </div>
      <div
        className={`w-[96%] mx-auto  grid grid-cols-6 gap-3 p-3 ${
          fullheight ? "mt-0" : "mt-10"
        }`}
      >
        {/* Terms */}
        <div className="flex items-center col-span-1">
          <span className="w-[35%] text-right inline-block">Terms:</span>
          <input
            type="text"
            name="terms"
            value={formData.terms}
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
            value={"Main Branch"}
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
            value={formData.LOC}
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
            value={formData.DocNo}
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
            value={formData.date}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled
          />
        </div>

        {/* Acc.Code */}
        <div className="flex items-center col-span-1">
          <span className="w-[36%] text-right inline-block">Acc.Code:</span>
          <input
            type="text"
            name="accCode"
            value={formData.accCode}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          />
        </div>

        {/* Invoice Name */}
        <div className="flex items-center col-span-2 relative">
          <span className="w-[13%] text-right inline-block">Name:</span>
          <input
            type="text"
            value={formData.accountName}
            onChange={handleAccountNameSelect}
            className={`h-7 px-1 border border-gray-600  w-full ml-1  ${
              mode != "delete" ? "bg-white" : ""
            } `}
            disabled
          />
          {!isModeDelete && (
            <Popup
              items={customers}
              onSelect={handleAccountNameSelect}
              style={{ top: "top-1 left-[95%]" }}
              columns={[
                { key: "name", label: "Name" },
                { key: "address", label: "Address" },
                { key: "mobile", label: "Mobile" },
                { key: "email", label: "Email" },
                { key: "description", label: "Description" },
                { key: "SAL", label: "SAL#" },
                { key: "area", label: "Area" },
                { key: "vatCode", label: "VAT code" },
                { key: "TmId", label: "TmID" },
              ]}
            />
          )}
        </div>

        {/* Ref No */}
        <div className="flex items-center col-span-1">
          <span className="w-[40%] text-right inline-block">Ref No:</span>
          <input
            type="text"
            name="refNo"
            value={formData.refNo}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          />
        </div>

        {/* Curr */}
        <div className="flex items-center col-span-1 relative">
          <span className="w-[40%] text-right inline-block">Curr:</span>
          <input
            type="text"
            name="curr"
            value={formData.curr}
            className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
              mode != "delete" ? "bg-white" : ""
            }    `}
            disabled
          />
          {!isModeDelete && (
            <Popup
              items={currencyData}
              onSelect={handleCurrencyChange}
              style={{ top: "top-1 left-[93%]" }}
              columns={[
                { key: "shortForm", label: "Short Form" },
                { key: "name", label: "Name" },
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
            value={formData.rate}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          />
        </div>

        {/* DocType */}

        <div className="flex relative items-center col-span-1">
          <span className="w-[48%] text-right inline-block text-nowrap">
            Doc Type:
          </span>
          <input
            type="text"
            name="Invoice Type"
            value={invoiceType}
            onChange={handleInputChange}
            className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
              mode != "delete" ? "bg-white" : ""
            }`}
            disabled
          />

          {!isModeDelete && (
            <Popup
              items={docTypeData}
              onSelect={handleDocTypeChange}
              style={{ top: "top-1 left-[92%]" }}
              columns={[
                { key: "shortForm", label: "Type" },
                { key: "name", label: "Name" },
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
            value={formData.note}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          />
        </div>

        {/* DocNo1 */}

        <div className="flex items-center col-span-1">
          <span className="w-[40%] text-right inline-block">Doc No:</span>
          <input
            type="text"
            name="docNo1"
            value={formData.docNo1}
            onChange={handleInputChange}
            className="h-7 px-1 border border-gray-600 w-full ml-1"
            disabled={mode === "delete"}
          />
        </div>

        {/* SupplierMan */}

        <div className="flex relative items-center col-span-1">
          <span className="w-[48%] text-right inline-block">S.Man:</span>
          <input
            type="text"
            name="sMan"
            value={formData.sMan}
            className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
              mode != "delete" ? "bg-white" : ""
            }`}
            disabled
          />

          {!isModeDelete && (
            <Popup
              items={sManData}
              onSelect={handleSManChange}
              style={{ top: "top-1 left-[93%]" }}
              columns={[{ key: "name", label: "Name" }]}
            />
          )}
        </div>

        {/* MDOc */}
        <div className="flex items-center col-span-1">
          <span className="w-[30%] text-right inline-block">MDoc:</span>
          <input
            type="Number"
            name="MDoc"
            value={formData.MDoc}
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
            value={formData.payment}
            className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
              mode != "delete" ? "bg-white" : ""
            }`}
            disabled
          />
          {!isModeDelete && (
            <Popup
              items={paymentData}
              onSelect={handlePaymentChange}
              style={{ top: "top-1 left-[92%]" }}
              columns={[{ key: "name", label: "Mode of Payment" }]}
            />
          )}
        </div>

        {/* DelPlace */}
        <div className="flex items-center col-span-1">
          <span className="w-[28%] text-right inline-block">DelPlace:</span>
          <input
            type="text"
            name="delPlace"
            value={formData.delPlace}
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
            value={formData.area}
            className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
              mode != "delete" ? "bg-white" : ""
            }`}
            disabled
          />

          {!isModeDelete && (
            <Popup
              items={areas}
              onSelect={handleAreaChange}
              style={{ top: "top-1 left-[92%]" }}
              columns={[
                { key: "name", label: "Area Name" },
                { key: "shortForm", label: "Area ShortForm" },
              ]}
              all={true}
            />
          )}
        </div>

        {/* PO No */}

        <div className="flex relative items-center col-span-1">
          <span className="w-[40%] text-right inline-block">PO No:</span>
          <input
            type="Number"
            name="PONo"
            value={formData.PONo}
            className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
              mode != "delete" ? "bg-white" : ""
            }`}
            disabled={isModeDelete}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex relative items-center col-span-1">
          <span className="w-[40%] text-right inline-block">Type:</span>
          <input
            type="text"
            name="type"
            value={formData.type}
            className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
              mode != "delete" ? "bg-white" : ""
            }`}
            disabled
          />
          {!isModeDelete && (
            <Popup
              items={typeData}
              onSelect={handleTypeDataChange}
              style={{ top: "top-1 left-[93%]" }}
              columns={[{ key: "name", label: "Name" }]}
            />
          )}
        </div>
      </div>
      { showQuotationTable && (
          <div className="mt-4">
            <div className="relative w-[274px]">
              Select Quotation: <input type="text"/>
              <Popup
                  items={quotations}
                  onSelect={handleInvoiceSelect}
                  style={{top: "top-[3px] left-[92%]"}}
                  columns={[
                    {key: "id", label: "Id"},
                    {key: "accountName", label: "Customer"},
                    {key: "DocNo", label: "DocNo"},
                    {key: "date", label: "Date"},
                    {key: "total", label: "Total"},
                  ]}
                  name={"invoiceList"}
                  all={true}
                  className="mt-10"
              />
            </div>
            {/*<QuotationTable/>*/}
            {/*<QoutationTable2 />*/}
          </div>
      )}
      {
        <div>
          <CashInvoiceTable
            formData={formData}
            onDataChange={handleRowChange}
            Rows={formData.products}
            mode={mode}
          />
        </div>
      }

      {/* totalDetails */}
      <div className="grid grid-cols-4 gap-3 mt-4 mb-4">
        <div className="flex relative items-center col-span-1">
          <span className="w-[40%] text-right inline-block">Gross Total:</span>
          <input
              value={totalDetails.grossTotal || 0}
              // type="number"
              name="grossTotal"
              className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
                  mode != "delete" ? "bg-white" : ""
              }`}
              disabled
          />
        </div>
        <div className="flex relative items-center col-span-1">
          <span className="w-[40%] text-right inline-block">Discount%:</span>
          <input
              type="number"
              // name="number"
              value={totalDetails.discount || 0}
              className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
                  mode != "delete" ? "bg-white" : ""
              }`}
              disabled
          />
        </div>
        <div className="flex relative items-center col-span-1">
          <span className="w-[40%] text-right inline-block">Amount:</span>
          <input
              type="number"
              name=""
              value={totalDetails.disAmount || 0}
              className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
                  mode != "delete" ? "bg-white" : ""
              }`}
              disabled
          />
        </div>
        <div className="flex relative items-center col-span-1">
          <span className="w-[40%] text-right inline-block">Extra Discount:</span>
          <input
              type="number"
              name=""
              className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
                  mode != "delete" ? "bg-white" : ""
              }`}
              onChange={(e) => handleExtraDiscountChange(e.target.value)}

          />
        </div>
        <div className="flex relative items-center col-span-1">
          <span className="w-[40%] text-right inline-block">Net Total:</span>
          <input
              type="number"
              name=""
              value={totalDetails.netTotal || 0}
              className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
                  mode != "delete" ? "bg-white" : ""
              }`}
              disabled
          />
        </div>
        <div className="flex relative items-center col-span-1">
          <span className="w-[40%] text-right inline-block">Vat Amount:</span>
          <input
              type="number"
              name=""
              value={totalDetails.vatAmount || 0}
              className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
                  mode != "delete" ? "bg-white" : ""
              }`}
              disabled
          />
        </div>
        <div className="flex relative items-center col-span-1">
          <span className="w-[40%] text-right inline-block">Total:</span>
          {console.log(totalDetails.total)}
          <input
              type="number"
              value={roundDownTotal(totalDetails.total) || 0}
              className={`h-7 px-1 border border-gray-600 w-full ml-1 ${
                  mode !== "delete" ? "bg-white" : ""
              }`}
              disabled
          />
        </div>
        {/* Payment Fields */}
        <PaymentFields
            mode={mode}
            formData={formData}
            totalDetails={totalDetails}
            onPaymentChange={handlePaymentDetailsChange}
        />
      </div>

      {!(mode === "delete" && !Object.keys(initialInvoice).length === 0) && (
          <div className="flex space-x-2 mt-2">
            <button
                type="submit"
                onClick={handleSubmit}
                className="bg-white px-5 py-1 w-full border border-gray-100"
            >
              {mode} Invoice
            </button>
          </div>
      )}
    </form>
  );
}

export default CashInvoice;
