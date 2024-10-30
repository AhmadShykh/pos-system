import React, { useState, useEffect } from 'react';

const PaymentFields = ({ mode, formData, totalDetails , onPaymentChange }) => {
  const [cashAmount, setCashAmount] = useState(0);
  const [creditAmount, setCreditAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(totalDetails.total || 0);

  // Effect to set the total amount when formData changes
  useEffect(() => {
    if (totalDetails.total) {
      const updatedTotal = parseFloat(totalDetails.total);
      const finalTotal = Math.floor(updatedTotal)
      setTotalAmount(finalTotal);
      console.log("PaymentFields - Received totalAmount:", finalTotal);
    } else {
      console.log("PaymentFields - formData.total is undefined or zero");
    }
  }, [totalDetails.total]); // Dependency on formData.total

  // Effect to calculate credit amount based on cashAmount and totalAmount
  useEffect(() => {
    if (formData.payment === 'Both' && !isNaN(totalAmount) && !isNaN(cashAmount)) {
      const newCreditAmount = Math.max(totalAmount - cashAmount, 0);
      setCreditAmount(newCreditAmount);
      console.log("Calculated Credit Amount:", newCreditAmount);
      
      // Pass updated values to the parent component
      onPaymentChange({
        cashAmount: cashAmount,
        creditAmount: newCreditAmount,
      });
      console.log("Passing to Parent - Cash Amount:", cashAmount, "Credit Amount:", newCreditAmount);
    }
  }, [cashAmount, totalAmount, formData.payment]);

  // Handle changes to cash amount input
  const handleCashAmountChange = (event) => {
    const newCashAmount = parseFloat(event.target.value) || 0;

    // Ensure cashAmount does not exceed totalAmount
    if (newCashAmount > totalAmount) {
      setCashAmount(totalAmount);
      console.log("Cash Amount exceeded total, set to Total Amount:", totalAmount);
    } else {
      setCashAmount(newCashAmount);
      console.log("Updated Cash Amount:", newCashAmount);
    }
  };

  // Do not render anything if payment type is not 'Both'
  if (formData.payment !== 'Both') {
    return null;
  }

  return (
    <div className="flex items-center col-span-2 gap-4">
      <div className="flex relative items-center flex-1">
        <span className="w-[48%] text-right inline-block">Cash Amount:</span>
        <input
          type="number"
          value={cashAmount || ""}
          onChange={handleCashAmountChange}
          className={`h-7 px-1 border border-gray-600 w-full ml-1 ${mode !== "delete" ? "bg-white" : ""}`}
          disabled={mode === "delete"}
          min="0"
          max={totalAmount}
          step="0.01"
        />
      </div>
      <div className="flex relative items-center flex-1">
        <span className="w-[48%] text-right inline-block">Credit Amount:</span>
        <input
          type="number"
          value={creditAmount || ""}
          className="h-7 px-1 border border-gray-600 w-full ml-1 bg-gray-100"
          readOnly
        />
      </div>
    </div>
  );
};

export default PaymentFields;
