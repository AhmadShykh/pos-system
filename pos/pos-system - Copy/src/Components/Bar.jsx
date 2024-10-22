import React, { useState } from "react";
import bubble from "../Assets/bubble.png";
import Pencil from "../Assets/Pencil.png";
import Popup from "../Components/Popup";
import CashInvoice from "../Pages/CashInvoice";
const Bar = () => {
  return (
    <div>
      {/* Customer, Supplier Accounts */}
      {/* <div>
                <ul className='flex border-t border-slate-300'>
                    <li className='border-r p-2 px-4 font-semibold border-black  active:scale-95'>
                        <button className='w-full h-full'>Customer</button>
                    </li>
                    <li className='border-r p-2 px-4 font-semibold border-black  active:scale-95'>
                        <button className='w-full h-full'>Supplier</button>
                    </li>
                    <li className='border-r p-2 px-4 font-semibold border-black  active:scale-95'>
                        <button className='w-full h-full'>Accounts</button>
                    </li>
                </ul>
            </div> */}
      {/* Main Navbar */}
      <div className="border border-gray-400 ">
        <ul className="flex gap-2 ml-6">
          {/* QUOTATION */}

          <button
            onClick={() => {
              window.electron.ipcRenderer.send("openCashInvoice");
            }}
            className="nav-p flex gap-1 justify-center items-center text-xs font-semibold active:scale-95"
          >
            <li className="flex w-full h-full">
              <img src={bubble} className="lg:w-5 nah-h mr-1 w-4 lg:mr-5" />
              Quotation
            </li>
          </button>
          <button
            onClick={() => {
              window.electron.ipcRenderer.send("openInvoiceViewer");
            }}
            className="ml-1 mr-8    nav-p flex gap-1 justify-center items-center text-xs font-semibold active:scale-75 transition-all"
          >
            <img src={Pencil} className="lg:w-4 nav-ph w-3 " />
          </button>

          {/* SALES ORDER */}
          <button
            onClick={() => {
              window.electron.ipcRenderer.send("openPurchaseInvoice");
            }}
            className="nav-p flex gap-1 justify-center items-center text-xs font-semibold active:scale-95"
          >
            <li className="flex w-full h-full">
              <img src={bubble} className="lg:w-5  mr-1 w-4 nah-h lg:mr-5" />
              Sales Order
            </li>
          </button>
          <button
            onClick={() => {
              window.electron.ipcRenderer.send("openInvoiceViewer");
            }}
            className="ml-1 mr-8    nav-p flex gap-1 justify-center items-center text-xs font-semibold active:scale-75 transition-all"
          >
            <img src={Pencil} className="lg:w-4 w-3 nav-ph" />
          </button>

          {/* DELIVERY NOTE */}
          <button
            onClick={() => {
              window.electron.ipcRenderer.send("openCashInvoice");
            }}
            className="nav-p flex gap-1 justify-center items-center text-xs font-semibold active:scale-95"
          >
            <li className="flex w-full h-full">
              <img src={bubble} className="lg:w-5 mr-1 w-4 nah-h lg:mr-5" />
              Delivery Note
            </li>
          </button>
          <button
            onClick={() => {
              window.electron.ipcRenderer.send("openInvoiceViewer");
            }}
            className="ml-1 mr-8    nav-p flex gap-1 justify-center items-center text-xs font-semibold active:scale-75 transition-all"
          >
            <img src={Pencil} className="lg:w-4 w-3 nav-ph" />
          </button>

          {/* CASH INVOICE */}
          <button
            className="nav-p flex gap-1 justify-center items-center text-xs font-semibold active:scale-95"
            onClick={() => {
              window.electron.ipcRenderer.send("openCashInvoice");
            }}
          >
            <li className="flex w-full h-full">
              <img src={bubble} className="lg:w-5 mr-1 w-4 nah-h lg:mr-5" />
              Cash Invoice
            </li>
          </button>
          <button
            onClick={() => {
              window.electron.ipcRenderer.send("openInvoiceViewer");
            }}
            className="ml-1 mr-8 nav-p flex gap-1 justify-center items-center text-xs font-semibold active:scale-75 transition-all"
          >
            <img src={Pencil} className="lg:w-4 w-3 nav-ph" />
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Bar;
