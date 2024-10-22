import React, { useEffect, useState } from "react";
import Popup from "../Components/Popup";
import CashInvoice, { CashInvoiceForm } from "./CashInvoice";
import PurchaseInvoice, { PurchaseForm } from "./PurchaseInvoice";
import { getAllCashInvoices } from "../../db/cashInvoice";
import { getAllPurchaseInvoices } from "../../db/purchaseInvoice";
import { getAllDeliveryNote } from "../../db/deliveryNote";
import { getAllQuotations } from "../../db/quotation";

/**
 *
 * @typedef {import ('../../db/cashInvoice').CashInvoice} CashInvoice
 * @typedef {import ('../../db/purchaseInvoice').PurchaseInvoice} PurchaseInvoice
 */

const InvoiceViewer = () => {
  /**
   * @type {[CashInvoice[], (invoices: CashInvoice[]) => void]}
   */
  const [invoices, SetInvoices] = useState([]);

  /**
   * @type {[CashInvoice[], (invoices: CashInvoice[]) => void]}
   */
  const [delivery, setDelivery] = useState([]);

  /**
   * @type {[CashInvoice[], (invoices: CashInvoice[]) => void]}
   */
  const [quotation, setQuotation] = useState([]);

  /**
   * @type {[PurchaseInvoice[], (invoices: PurchaseInvoice[]) => void]}
   */
  const [purchaseInvoiceList, setPurchaseInvoiceList] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const invoices = await getAllCashInvoices();
      SetInvoices(invoices);
    };
    const fetchPurchaseList = async () => {
      const purchaseInvoice = await getAllPurchaseInvoices();
      setPurchaseInvoiceList(purchaseInvoice);
    };
    fetchInvoices();
    fetchPurchaseList();
    fetchDN();
    fetchQuotation();
  }, []);

  const fetchDN = async () => {
    const data = await getAllDeliveryNote();
    setDelivery(data);
  };
  const fetchQuotation = async () => {
    const data = await getAllQuotations();
    setQuotation(data);
  };

  const [showSelection, setShowSelection] = useState(true);
  const [selectedItem, setSelectedItem] = useState({});
  const handleSelect = (selectedItem) => {
    setSelectedItem(selectedItem);
    setShowSelection(false);
  };

  return (
    <>
      {showSelection && (
        <div className="min-h-[100vh]">
          <div className="min-h-[20vh] flex   justify-center">
            <div className="flex  border relative mt-10 justify-center mx-auto w-[30%]">
              <span className="mr-2">Select Cash Invoice:</span>
              <input
                type="text"
                className="border w-[55%] h-7 px-1 text-sm bg-white cursor-pointer"
                placeholder="View Invoices"
                disabled
                readOnly
              />
              {
                <Popup
                  items={invoices}
                  columns={[
                    { key: "DocNo", label: "Bill No" },
                    { key: "date", label: "Bill Date" },
                    { key: "accCode", label: "Account" },
                    { key: "accountName", label: "Account Name" },
                    { key: "total", label: "Amount" },
                    { key: "doctype", label: "DOC type" },
                    { key: "sMan", label: "S.Id" },
                    { key: "payment", label: "Tr.type" },
                  ]}
                  onSelect={handleSelect}
                  style={{ top: "top-[5px] left-[88%] " }}
                  all={true}
                  name={"invoiceList"}
                />
              }
            </div>
            <div className="flex  border relative mt-10 justify-center mx-auto w-[40%]">
              <span className="mr-2">Select Purchase Invoice:</span>
              <input
                type="text"
                className="border w-[40%] h-7 px-1 text-sm bg-white cursor-pointer"
                placeholder="View Invoices"
                disabled
                readOnly
              />
              {
                <Popup
                  items={purchaseInvoiceList}
                  columns={[
                    { key: "invoiceNo", label: "Bill No" },
                    { key: "supplierId", label: "Supplier ID" },
                    { key: "supplierName", label: "Supplier Name" },
                    { key: "date", label: "Date" },
                  ]}
                  onSelect={handleSelect}
                  style={{ top: "top-[5px] left-[81%] " }}
                  all={true}
                  name={"invoiceList"}
                />
              }
            </div>
          </div>
          <div className="min-h-[20vh] flex   justify-center">
            <div className="flex  border relative mt-10 justify-center mx-auto w-[30%]">
              <span className="mr-2">Select Delivery Note:</span>
              <input
                type="text"
                className="border w-[55%] h-7 px-1 text-sm bg-white cursor-pointer"
                placeholder="View Invoices"
                disabled
                readOnly
              />
              {
                <Popup
                  items={delivery}
                  columns={[
                    { key: "DocNo", label: "Bill No" },
                    { key: "date", label: "Bill Date" },
                    { key: "accCode", label: "Account" },
                    { key: "accountName", label: "Account Name" },
                    { key: "total", label: "Amount" },
                    { key: "doctype", label: "DOC type" },
                    { key: "sMan", label: "S.Id" },
                    { key: "payment", label: "Tr.type" },
                  ]}
                  onSelect={handleSelect}
                  style={{ top: "top-[5px] left-[88%] " }}
                  all={true}
                  name={"invoiceList"}
                />
              }
            </div>
            <div className="flex  border relative mt-10 justify-center mx-auto w-[40%]">
              <span className="mr-2 w-[26%] text-right">
                Select Quotation :
              </span>
              <input
                type="text"
                className="border w-[40%] h-7 px-1 text-sm bg-white cursor-pointer"
                placeholder="View Invoices"
                disabled
                readOnly
              />
              {
                <Popup
                  items={quotation}
                  columns={[
                    { key: "DocNo", label: "Bill No" },
                    { key: "date", label: "Bill Date" },
                    { key: "accCode", label: "Account" },
                    { key: "accountName", label: "Account Name" },
                    { key: "total", label: "Amount" },
                    { key: "doctype", label: "DOC type" },
                    { key: "sMan", label: "S.Id" },
                    { key: "payment", label: "Tr.type" },
                  ]}
                  onSelect={handleSelect}
                  style={{ top: "top-[5px] left-[80%] " }}
                  all={true}
                  name={"invoiceList"}
                />
              }
            </div>
          </div>
        </div>
      )}
      {Object.keys(selectedItem).includes("supplierName") ? (
        <div div className="w-[95%] mx-auto mt-1">
          <PurchaseInvoice mode={"Edit"} initialInvoice={selectedItem} />
        </div>
      ) : (
        Object.keys(selectedItem).length > 0 && (
          <div className="w-[95%] mx-auto mt-1">
            <CashInvoice mode={"edit"} initialInvoice={selectedItem} />
          </div>
        )
      )}
    </>
  );
};

export default InvoiceViewer;
