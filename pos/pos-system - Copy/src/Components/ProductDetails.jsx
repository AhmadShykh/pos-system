import React, { useEffect, useState } from "react";
import open from "../Assets/open.png";
import MachineProductSelector from "./MachineProductSearch";
import { getProductByCode } from "../../db/products";

/**
 *
 * @param {Object} props
 * @param {import("../../db/products").Product} props.selectedProduct - The selected product object
 * @param {React.Dispatch<React.SetStateAction<import("../../db/products").Product>>} props.setSelectedProduct - The function to set the selected product object
 * @returns
 */

const ProductDetails = ({ selectedProduct, setSelectedProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.code === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    });

    return () =>
      window.addEventListener("keydown", (e) => {
        if (e.code === "Escape" && isModalOpen) {
          handleCloseModal();
        }
      });
  }, [isModalOpen]);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    handleCloseModal();
  };

  const handleInputChange = async (e) => {
    const { value } = e.target;
    setSelectedProduct((prev) => ({ ...prev, productCode: value }));
    const product = await getProductByCode(value);
    if (product) {
      setSelectedProduct(product);
    }
  };

  return (
    <>
      <div className="w-[96%] font-medium mx-auto gap-8  flex justify-between">
        {/* 1st col of details */}
        <div className="flex flex-col gap-1  2xl:w-[30%] w-[50%]">
          {/* Product Code */}
          <div className="flex w-full ">
            <span className="font-bold w-[35%] 2xl:w-[25%] text-blue-800 text-sm">
              Product Code:
            </span>
            <div className="text-sm 2xl:w-[75%] w-[65%] border uppercase bg-blue-100 border-gray-600 px-1 flex items-center justify-between">
              <input
                type="text"
                className="bg-transparent w-full outline-none"
                value={selectedProduct.productCode || ""}
                onChange={handleInputChange}
              />
              {/* <span className="flex-grow">
                {selectedProduct.productCode || "NA"}
              </span>{" "} */}
              {/* Use `id` for the Product Code */}
              <button onClick={handleOpenModal}>
                <img src={open} alt="Open Search" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center ">
              <div className="p-4 rounded shadow-lg max-w-[95vw] min-w-[95vw] bg-background  ">
                <button
                  className="text-red-500 mb-2"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <MachineProductSelector onProductSelect={handleProductSelect} />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="flex border  w-full">
            <span className="font-bold w-[35%] 2xl:w-[25%]  text-blue-800 text-sm">
              Description:
            </span>
            <div className="text-sm   2xl:w-[75%]  w-[65%]   border  uppercase bg-white border-gray-600 px-1 ">
              {selectedProduct.description || "NA"}
            </div>
          </div>

          {/* Specification */}
          <div className="flex border  w-full">
            <span className="font-bold w-[35%] 2xl:w-[25%]  text-red-950 text-sm">
              Specification:
            </span>
            <div className="text-sm h-14 overflow-y-scroll 2xl:w-[75%]  w-[65%]   border  uppercase bg-blue-100 border-gray-600 px-1 ">
              {selectedProduct.description2 || "NA"}
            </div>
          </div>

          {/*Pack Qty */}
          <div className="flex border justify-between  items-center">
            <div
              className="flex justify-between    items-center  2xl:w-[40%] 
                        w-[50%]  2xl:gap-0  gap-8"
            >
              <span className="font-bold text-center text-red-950 text-sm 2xl:w-[90%] w-full   ">
                Pack Qty:
              </span>
              <div className="bg-white w-[6rem] border border-gray-600 px-1">
                {selectedProduct.quantity || "NA"}
              </div>
            </div>

            <div className="flex justify-between items-center w-[40%]">
              <span className="font-bold  text-red-950 text-sm">Unit:</span>
              <div className="bg-white w-24 border border-gray-600 px-1">
                {selectedProduct.basicUnit || "NA"}
              </div>
            </div>
          </div>

          {/* max order */}

          <div className="flex border  w-full">
            <span className="font-bold w-[35%] 2xl:w-[25%]  text-red-950 text-sm">
              Max Order:
            </span>
            <div className="text-sm  2xl:w-[75%]  w-[65%]   border  uppercase bg-white border-gray-600 px-1 text-right ">
              {selectedProduct.maxOrder || "NA"}
            </div>
          </div>

          {/* Re-order */}
          <div className="flex border  w-full">
            <span className="font-bold w-[35%] 2xl:w-[25%]  text-red-950 text-sm">
              Re-Order:
            </span>
            <div className="text-sm  2xl:w-[75%]  w-[65%]   border  uppercase bg-white border-gray-600 px-1 text-right ">
              {selectedProduct.reOrder || "NA"}
            </div>
          </div>
        </div>

        {/* 2nd col of details */}
        <div className="flex flex-col gap-2  2xl:w-[30%] w-[50%] ">
          {/* OEM No */}
          <div className="flex items-center   justify-center    ">
            <span className="text-sm 2xl:w-[20%] w-[30%] font-bold text-center  text-red-950">
              OEM No:
            </span>
            <div className=" ml-1 text-sm     w-[80%]  border  uppercase bg-white border-gray-600 px-1">
              0
            </div>
          </div>

          {/* Lst Suppl */}
          <div className="flex items-center  justify-center    ">
            <span className="text-sm  2xl:w-[20%] w-[30%] text-center font-bold   text-red-950">
              Lst Suppl:
            </span>
            <div className=" ml-1 text-sm     w-[80%]  border  uppercase bg-white border-gray-600 px-1">
              {selectedProduct.lastSupplier || "NA"}
            </div>
          </div>

          {/* Avg Cost */}

          <div className="flex justify-between ">
            <div className="flex items-center   w-[60%]    ">
              <span className="text-sm w-[4.8rem]  text-center font-bold   text-red-950">
                Lst Pur.Cst:
              </span>
              <div className=" ml-1 text-right text-sm bg-white w-[40%]  border  uppercase  border-gray-600 px-1">
                {selectedProduct.lastPurCost || "NA"}
              </div>
            </div>
            <div className="flex items-center   w-[60%]    ">
              <span className="text-sm w-[3.8rem]  text-center font-bold   text-red-950">
                AvgCost:
              </span>
              <div className=" ml-1 text-right text-sm bg-white  w-[70%] border  uppercase  border-gray-600 px-1">
                {selectedProduct.averageCost || "NA"}
              </div>
            </div>
          </div>

          {/* Sell Price 2 */}
          <div>
            <div className="flex items-center  justify-center    ">
              <span className="text-sm 2xl:w-[20%] w-[30%]  font-bold text-left  text-red-950">
                Sell Price2:
              </span>
              <div className=" ml-1 text-sm text-right  w-[80%]  border  uppercase bg-white border-gray-600 px-1">
                {selectedProduct.sellingPrice2 || "NA"}
              </div>
            </div>
          </div>

          {/* Sell Price 1 */}
          <div className="flex justify-between ">
            <div className="flex items-center   w-[60%]    ">
              <span className="text-sm w-[4.8rem]  text-center font-bold   text-red-950">
                Sell Price1:
              </span>
              <div className=" ml-1 text-right text-sm bg-white w-[40%]  border  uppercase  border-gray-600 px-1">
                {selectedProduct.sellingPrice1 || "NA"}
              </div>
            </div>
            <div className="flex items-center   w-[60%]    ">
              <span className="text-sm w-[3.8rem]  text-center font-bold   text-red-950">
                Margin%:
              </span>
              <div className=" ml-1 text-right text-sm bg-white  w-[70%] border  uppercase  border-gray-600 px-1">
                {selectedProduct.averageCost && selectedProduct.sellingPrice1
                  ? (selectedProduct.sellingPrice1 -
                      selectedProduct.averageCost) /
                    100
                  : 0}
              </div>
            </div>
          </div>

          {/* Vat out */}
          <div className="flex justify-between ">
            <div className="flex items-center   w-[60%]    ">
              <span className="text-sm w-[4.8rem]  text-right font-bold   text-red-950">
                Vat out:
              </span>
              <div className=" ml-1 text-right text-sm bg-white w-[40%]  border  uppercase  border-gray-600 px-1">
                {selectedProduct.vatType || "NA"}
              </div>
            </div>
            <div className="flex items-center   w-[60%]    ">
              <span className="text-sm w-[3.8rem]  text-right font-bold   text-red-950">
                %:
              </span>
              <div className=" ml-1 text-right text-sm bg-white  w-[70%] border  uppercase  border-gray-600 px-1">
                0
              </div>
            </div>
          </div>

          {/* Price with Vat */}
          <div className="flex items-center  justify-center    ">
            <span className="text-sm  2xl:w-[20%] w-[50%] text-center font-bold   text-red-950">
              vat Price:
            </span>
            <div className=" ml-1 text-sm      w-[80%]  border  uppercase bg-white border-gray-600 px-1">
              Local purchase
            </div>
          </div>
        </div>

        {/* 3rd col of details */}
        <div className="flex flex-col  gap-[5px] 2xl:w-[30%] w-[50%] ">
          {/* BRAND */}
          <div className="flex items-center w-full ">
            <span className="text-sm 2xl:w-[12%] w-[30%]  font-bold  text-red-950">
              Brand:
            </span>
            <div className="  text-sm   mr-1  2xl:w-[30%] w-[40%]  border  uppercase bg-white border-gray-600 px-1">
              {selectedProduct.brand || "NA"}
            </div>
            <div className="  text-sm     w-[60%]  border  uppercase bg-white border-gray-600 px-1">
              {selectedProduct.brand || "NA"}
            </div>
          </div>

          {/* Dept */}
          <div className="flex gap-3   ">
            <span className="font-bold  text-red-950 text-sm">Dept:</span>
            <div className="  text-sm     w-[90%]  border  uppercase bg-white border-gray-600 px-1">
              {selectedProduct.department || "NA"}
            </div>
          </div>

          {/* Group */}

          <div className="flex w-full justify-between  items-center">
            <div className="flex justify-between gap-1 items-center">
              <span className="font-bold  text-red-950 text-sm  ">Group:</span>
              <div className="bg-white w-36 border border-gray-600 px-1">
                {selectedProduct.category || "NA"}
              </div>
            </div>
            <div className="flex justify-between gap-1 items-center">
              <span className="font-bold  text-red-950 text-sm">Sub.Grp:</span>
              <div className="bg-white w-36 border border-gray-600 px-1">
                {selectedProduct.subCategory || "NA"}
              </div>
            </div>
          </div>

          {/* Loc */}
          <div className="flex w-full justify-between  items-center">
            <div className="flex justify-between gap-6 items-center">
              <span className="font-bold  text-red-950 text-sm  ">Loc:</span>
              <div className="bg-white w-36 border border-gray-600 px-1">2</div>
            </div>
            <div className="flex justify-between gap-1 items-center">
              <span className="font-bold  text-red-950 text-sm">Stk.Typ:</span>
              <div className="bg-white w-36 border border-gray-600 px-1">
                HY
              </div>
            </div>
          </div>

          {/* Origin */}

          <div className="flex w-full justify-between  items-center">
            <div className="flex justify-between gap-1 items-center">
              <span className="font-bold  text-red-950 text-sm  ">Origin:</span>
              <div className="bg-white w-36 border border-gray-600 px-1">
                {selectedProduct.origin || "NA"}
              </div>
            </div>
            <div className="flex justify-between gap-1 items-center">
              <span className="font-bold  text-blue-800 text-sm">Unq.ID:</span>
              <div className="bg-white w-36 border border-gray-600 px-1">
                {selectedProduct.uniqueId || "NA"}
              </div>
            </div>
          </div>

          {/* ETA */}
          <div className="flex w-full justify-between  items-center">
            <div className="flex justify-between gap-5 items-center">
              <span className="font-bold  text-red-950 text-sm  ">ETA:</span>
              <div className="bg-white w-36 border border-gray-600 px-1">
                //
              </div>
            </div>
            <div className="flex justify-between gap-1 items-center">
              <span className="font-bold  text-red-950 text-sm">ETD:</span>
              <div className="bg-white w-36 border border-gray-600 px-1">
                //
              </div>
            </div>
          </div>

          {/* Prod Type */}
          <div className="flex w-full justify-between  items-center">
            <div className="flex justify-between -ml-5 items-center">
              <span className="font-bold  text-red-950 text-sm  ">
                Prod Type:
              </span>
              <div className="bg-white w-36 border border-gray-600 px-1">
                HY
              </div>
            </div>
            <div className="flex justify-between gap-1 items-center">
              <span className="font-bold  text-red-950 text-sm">Qty</span>
              <div className="bg-white w-36 border border-gray-600 px-1">
                {selectedProduct.quantity || "NA"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
