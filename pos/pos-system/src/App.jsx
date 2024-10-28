import React, { useEffect } from "react";
// import {  } from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import ProductMastery from "./Pages/ProductMastery";
import CashInvoice from "./Pages/CashInvoice";
import MachineProductSelector from "./Components/MachineProductSearch";
import AppliedModel from "./Components/AppliedModel";
import InvoiceViewer from "./Pages/InvoiceViewer";
import PurchaseInvoice from "./Pages/PurchaseInvoice";
import CustomerMastery from "./Pages/CustomerMastery";
import AddArea from "./Components/AddArea";
import AddBrand from "./Components/AddBrand";
import AddSubCategory from "./Components/AddSubCategory";
import AddCategory from "./Components/AddCategory";
import Return from "./Pages/Return";
function App() {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        console.log({ path: window.location });
        if (window.location.hash !== "#/" && window.location.hash !== "")
          window.close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Router>
      <div className="bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ProductMastery" element={<ProductMastery />} />
          <Route path="/CashInvoice" element={<CashInvoice />} />
          <Route
            path="/selectProduct"
            element={<MachineProductSelector />}
          ></Route>
          <Route path="/InvoiceViewer" element={<InvoiceViewer />}></Route>
          <Route path="/Return" element={<Return />}></Route>
          <Route path="/PurchaseInvoice" element={<PurchaseInvoice />}></Route>
          <Route path="/CustomerMastery" element={<CustomerMastery />}></Route>
          <Route path="/AddArea" element={<AddArea />}></Route>
          <Route path="/AddBrand" element={<AddBrand />}></Route>
          <Route path="/AddSubCategory" element={<AddSubCategory />}></Route>
          <Route path="/AddCategory" element={<AddCategory />}></Route>
          <Route path="/PrintReport" element={<AddCategory />}></Route>
          <Route path="*" element={<Home />} /> {/* Catch-all route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
