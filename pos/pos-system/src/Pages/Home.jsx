import React, { useEffect, useState } from "react";
import Bar from "../Components/Bar";
import ProductDetails from "../Components/ProductDetails";
import Table from "../Components/Table";
import { getCashInvoicesByProductCode } from "../../db/cashInvoice";
import { getQuotationsByProductCode } from "../../db/quotation";
import { getDeliveryNotesByProductCode } from "../../db/deliveryNote";
import { getPurchaseInvoicesWithProductDetails } from "../../db/purchaseInvoice";
import bgImg from "../Assets/example.png";
import { getProductByCode } from "../../db/products";

/**
 * @typedef {import('../../db/products').Product} Product
 */

const Home = () => {
  /**
   * @type {[Product, React.Dispatch<React.SetStateAction<Product>>]}
   */
  const [selectedProduct, setSelectedProduct] = useState({
    productNo: "",
    name: "",
    supplierName: "",
    oemCode: "",
    uniqueId: "",
    description: "",
    specification: "",
    packQty: "HY",
    unit: "HY",
    maxOrder: 0.0,
    reOrder: 0.0,
    oemNo: 0,
    lstSuppl: "Local purchase",
    lstPurCst: 14.78,
    avgCost: 14.78,
    sellPrice2: 0,
    sellPrice1: 14.78,
    margin: 0,
    vatOut: 14.78,
    vatPrice: "Local purchase",
    brand: "Origin",
    dept: 0,
    group: "HY",
    subGrp: "HY",
    loc: "HY",
    stkTyp: "HY",
    origin: "HY",
    eta: "",
    etd: "",
    prodType: "HY",
    qty: "HY",
    alternatives: [],
    appliedModels: [],
  });

  const [cashInvoice, setCashInvoice] = useState([]);
  const [quotation, setQuotation] = useState([]);
  const [deliveryNote, setDeliveryNote] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const invoices = await getCashInvoicesByProductCode(
        selectedProduct.productCode
      );
      setCashInvoice(invoices);
      const quotation = await getQuotationsByProductCode(
        selectedProduct.productCode
      );
      setQuotation(quotation);
      const dn = await getDeliveryNotesByProductCode(
        selectedProduct.productCode
      );
      setDeliveryNote(dn);
      const purchaseHistory = await getPurchaseInvoicesWithProductDetails(
        selectedProduct.productCode
      );
      setPurchaseHistory(purchaseHistory);
    };
    if (selectedProduct) {
      fetchData();
    }
  }, [selectedProduct]);

  const getAlternativeForDisplay = async (productCode) => {
    if (!productCode) return;
    const product = await getProductByCode(productCode);
    setSelectedProduct(product);
  };

  const MultilocationData = [];

  return (
    <div className="bg-background min-h-[100vh]">
      {/* First two bars */}
      <Bar />

      {/* 1st row */}
      <div className="border-b border-t border-b-gray-300 border-t-gray-300">
        <div className="xl:w-[100%] w-[100%] m-auto flex flex-wrap items-center justify-center gap-3">
          {/* Fields */}
          <div className="w-[50%] flex gap-10 items-center">
            {/* Branch */}
            <div className="w-[20%] flex items-center">
              <label htmlFor="Branch" className="text-sm font-semibold">
                Branch:{" "}
              </label>
              <input
                type="text"
                id="Branch"
                className="outline-none border border-gray-700 w-[99%] text-center ml-2 bg-white font-semibold"
                value={2}
                disabled
              />
            </div>

            {/* Name */}
            <div className="flex items-center w-[80%]">
              <label htmlFor="Name" className="text-sm font-semibold">
                Name:{" "}
              </label>
              <input
                type="text"
                id="Name"
                className="outline-none border w-[90%] border-gray-700 ml-2 bg-white px-2 font-semibold"
                value={selectedProduct.name}
                disabled
              />
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-4 items-center">
            <a href="/" className="text-blue-500 underline text-xs">
              edit
            </a>
            <a href="/" className="text-blue-500 underline text-xs">
              Product transactions
            </a>
            <a href="/" className="text-blue-500 underline text-xs">
              Transaction Search
            </a>
            <a href="/" className="text-blue-500 underline text-xs">
              Product Search
            </a>
            <a href="/" className="text-blue-500 underline text-xs">
              Duplicate
            </a>
          </div>

          {/* Add delete Picture */}
          {/* <div className="flex gap-2 items-center h-full">
            <button className="bg-white w-40 border-gray-50">Add Pict</button>
            <button className="bg-white w-40 border-gray-50">Del Pict</button>
          </div> */}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex mt-5">
        <div className="w-[76%]">
          <ProductDetails
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
        </div>
        <div className="w-[22%] border  mr-2">
          <Table
            name="Multilocation"
            data={MultilocationData}
            columns={[
              { key: "station", header: "Station" },
              { key: "lastPrice", header: "Last Price" },
              { key: "qty", header: "Qty" },
              { key: "location", header: "Location" },
            ]}
            highlightColumn="station"
            heighValue={10}
          />
        </div>
      </div>

      {/* Tables */}
      <div className="mt-5">
        {/* First Row */}
        <div className="w-[97%] max-h-[20vh] flex justify-between 2xl:gap-0 gap-4 mx-auto">
          {/* Product Image */}
          <div className="w-[12%] 2xl:w-[15%] flex flex-col items-center justify-center overflow-hidden">
            <div className="w-full min-h-5 bg-gray-500">{/* Gray Div */}</div>
            <div
              className="w-80 h-56 bg-no-repeat"
              style={{
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundImage: `url(${selectedProduct.picture || bgImg})`,
              }}
            ></div>
          </div>

          {/* Applied Model Table */}
          <div className="w-[14.5%] 2xl:w-[22%]">
            <Table
              name="Applied Model"
              data={selectedProduct.appliedModels}
              columns={[
                { key: "make", header: "Make" },
                { key: "type", header: "Type" },
                { key: "remarks", header: "Remarks" },
              ]}
              highlightColumn="Make"
            />
          </div>

          {/* Purchase History Table */}
          <div className="w-40%">
            <Table
              name="Purchase History"
              data={purchaseHistory}
              columns={[
                { key: "Br", header: "Br" },
                { key: "id", header: "GRN.No" },
                { key: "date", header: "Pur.Date" },
                { key: "Type", header: "Type" },
                { key: "supplierName", header: "Supplier Name" },
                { key: "quantity", header: "Qty" },
                { key: "price", header: "Unit Price" },
                { key: "total", header: "Total" },
                // { key: "Pos", header: "POS" },
              ]}
              highlightColumn="UnitPrice"
            />
          </div>

          {/* Product Details Table */}
          <div className="w-[30%] 2xl:w-[23%]">
            <Table
              name="Product Details"
              data={selectedProduct.alternatives}
              columns={[
                { key: "productCode", header: "Product Code" },
                { key: "brand", header: "Brand" },
                { key: "name", header: "Product Name" },
                { key: "sellingPrice1", header: "Selling" },
                // { key: "Qty", header: "Qty" },
              ]}
              handleRowClick={(row) => {
                getAlternativeForDisplay(row.productCode);
              }}
              highlightColumn="productCode"
            />
          </div>
        </div>

        {/* 2nd Row */}
        <div className="w-[97%] flex min-h-[30vh] justify-between mx-auto mt-8">
          <div className="w-[33%]">
            <Table
              name="Quotation History"
              data={quotation}
              columns={[
                { key: "Br", header: "Br" },
                { key: "id", header: "Qutn.No" },
                { key: "date", header: "Qutn Date" },
                { key: "accountName", header: "Customer" },
                { key: "quantity", header: "Qty" },
                { key: "gAmount", header: "Unit Price" },
                { key: "total", header: "Total" },
              ]}
              highlightColumn="Br"
            />
          </div>
          <div className="w-[33%]">
            <Table
              name="Delivery Note History"
              data={deliveryNote}
              columns={[
                { key: "Br", header: "Br" },
                { key: "id", header: "DO.No" },
                { key: "date", header: "DO Date" },
                { key: "type", header: "Doc.Type" },
                { key: "accountName", header: "Customer" },
                { key: "quantity", header: "Qty" },
                { key: "gAmount", header: "Unit Price" },
                { key: "total", header: "Total" },
              ]}
              highlightColumn="Br"
            />
          </div>
          <div className="w-[32%]">
            <Table
              name="Sales History"
              data={cashInvoice}
              columns={[
                { key: "Br", header: "Br" },
                { key: "id", header: "Bill.No" },
                { key: "date", header: "Bill Date" },
                { key: "type", header: "Type" },
                { key: "accountName", header: "Customer" },
                { key: "quantity", header: "Qty" },
                { key: "gAmount", header: "Unit Price" },
              ]}
              highlightColumn="Customer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
