import React, { useEffect, useState } from "react";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../../db/products";
import AppliedModel from "../Components/AppliedModel";
import Popup from "../Components/Popup";
import Table from "../Components/Table";

import { getAllBrands } from "../../db/brands";
import { getAllCategories } from "../../db/category";

/**
 * @typedef {import('../../db/area').Area} Area
 * @typedef {import('../../db/products').Product} Product
 * @typedef {import('../../db/brands').Brand} Brand
 * @typedef {import('../../db/category').Category} Category
 */

import { saveImageAsBase64 } from "../../utils/fileupload";
import select from "../Assets/select.png";
import MachineProductSelector from "../Components/MachineProductSearch";

export const vat = [
  {
    shortForm: "EX1",
    Description: "No Vat",
    Vatpercentage: "0.00",
    startDate: "12/0/0",
  },
  {
    shortForm: "EX2",
    Description: "Standard Vat",
    Vatpercentage: "5",
    startDate: "12/0/0",
  },
];

// Driver function
function ProductMastery() {
  // State to track the selected action
  const [action, setAction] = useState("none");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditField, setEditField] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * @type {[Product[], import('react').Dispatch<import('react').SetStateAction<Product[]>>]}
   */
  const [products, setProducts] = useState([]);
  /**
   * @type {[Brand[], import('react').Dispatch<import('react').SetStateAction<Brand[]>>]}
   */
  const [brands, setBrands] = useState([]);
  /**
   * @type {[Category[], import('react').Dispatch<import('react').SetStateAction<Category[]>>]}
   */
  const [categories, setCategories] = useState([]);

  const fetchBrandCategory = async () => {
    const brands = await getAllBrands();
    setBrands(brands);
    const categories = await getAllCategories();
    setCategories(categories);
  };

  const fetchProducts = async () => {
    const products = await getAllProducts();
    setProducts(products);
  };

  useEffect(() => {
    fetchProducts();
    fetchBrandCategory();
  }, []);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setEditField(false);
    handleCloseModal();
  };

  // Function to handle changing actions
  const handleActionChange = (newAction) => {
    setAction(newAction);
    setSelectedProduct(null);
    setEditField(newAction === "edit");
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          <ProductForm
            mode={"delete"}
            initialProduct={{}}
            cb={fetchProducts}
            handleActionChange={handleActionChange}
            brands={brands}
            categories={categories}
          />
        )}
        {/* Show Product Form or Popup based on action */}
        {(action === "edit" || action === "delete") && !selectedProduct && (
          <div className="h-[94vh] flex flex-col items-center">
            <div>
              Select Product:{" "}
              <input type="text" disabled className="bg-white" />
              <button className="w-6 relative" onClick={handleOpenModal}>
                <img
                  src={select}
                  className="w-4 h-4 absolute -top-3 -left-5     "
                />{" "}
              </button>
            </div>
            {isModalOpen && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center ">
                <div className="p-4 rounded shadow-lg max-w-[95vw] min-w-[95vw] bg-background  ">
                  <button
                    className="text-red-500 mb-2"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <MachineProductSelector
                    onProductSelect={handleProductSelect}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {action === "add" && (
          <ProductForm
            mode={"add"}
            initialProduct={{ branch: 1 }}
            cb={fetchProducts}
            handleActionChange={handleActionChange}
            brands={brands}
            categories={categories}
          />
        )}

        {(action === "edit" || action === "delete") && selectedProduct && (
          <>
            <ProductForm
              mode={action}
              initialProduct={selectedProduct}
              cb={fetchProducts}
              handleActionChange={handleActionChange}
              brands={brands}
              categories={categories}
            />
          </>
        )}
      </div>
    </div>
  );
}

//actual working function
const initialFormData = {
  id: "",
  name: "",
  productCode: "",
  brand: "",
  description: "",
  description2: "",
  department: "",
  category: "",
  basicUnit: "",
  status: "",
  class: "",
  subCategory: "",
  uniqueId: "",
  sellingPrice1: "",
  sellingPrice2: "",
  sellingPrice3: "",
  picture: "",
  reOrder: "",
  hsCode: "",
  minOrder: "",
  maxOrder: "",
  shelfLife: "",
  vatType: "",
  origin: "",
  alternatives: [],
  appliedModels: [],
};

/**
 * ProductForm component for creating and editing products.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.mode - The mode of the form, either 'create' or 'edit'.
 * @param {Product} [props.initialProduct] - The initial product data for the form (used in edit mode).
 * @param {Function} props.cb - The callback function to handle form submission.
 * @param {Function} props.handleActionChange - The function to handle changes in form actions.
 * @param {Brand[]} props.brands - The list of available brands.
 * @param {Category[]} props.categories - The list of available categories.
 */
function ProductForm({
  mode,
  initialProduct,
  cb,
  handleActionChange,
  brands,
  categories,
}) {
  const [isModeDelete, setIsModeDelete] = useState(mode === "delete");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [formData, setFormData] = useState(initialFormData);
  /**
   * @type {[Category | null, import('react').Dispatch<import('react').SetStateAction<Category | null>>]}
   */
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (mode === "edit" || mode === "delete") {
      setFormData({
        id: initialProduct.id || "",
        branch: initialProduct.branch || "",
        name: initialProduct.name || "",
        productCode: initialProduct.productCode || "",
        brand: initialProduct.brand || "",
        description: initialProduct.description || "",
        description2: initialProduct.description2 || "",
        department: initialProduct.department || "",
        category: initialProduct.category || "",
        basicUnit: initialProduct.basicUnit || "",
        status: initialProduct.status || "",
        class: initialProduct.class || "",
        subCategory: initialProduct.subCategory || "",
        uniqueId: initialProduct.uniqueId || "",
        copyAllBranch: initialProduct.copyAllBranch || "NO",
        sellingPrice1: initialProduct.sellingPrice1 || "",
        sellingPrice2: initialProduct.sellingPrice2 || "",
        sellingPrice3: initialProduct.sellingPrice3 || "",
        picture: initialProduct.picture || "",
        reOrder: initialProduct.reOrder || "",
        hsCode: initialProduct.hsCode || "",
        minOrder: initialProduct.minOrder || "",
        maxOrder: initialProduct.maxOrder || "",
        shelfLife: initialProduct.shelfLife,
        vatType: initialProduct.vatType || "",
        origin: initialProduct.origin || "",
        barCode: initialProduct.barCode || "",
        appliedModels: initialProduct.appliedModels || [],
        alternatives: initialProduct.alternatives || [],
      });
    } else {
      // Clear form if mode is 'add'
      setFormData(initialFormData);
    }
  }, [mode, initialProduct]);

  const [file, setFile] = useState(null);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const tableData = [];

  // handling inputs for popups
  const handleBrandSelect = (brand) => {
    setFormData((prevData) => ({
      ...prevData,
      brand: brand || "",
    }));
  };


  const handleCateogorySelect = (category) => {
      // Find the selected category
      const selected = categories.find((c) => c.shortForm === category);

      // Check if subCategories is an object and convert it to an array
    if (selected && selected.subCategories && typeof selected.subCategories === 'object') {
        // Convert subCategories object to an array
        selected.subCategories = Object.values(selected.subCategories);
    } else {
        // If subCategories doesn't exist, initialize as an empty array
        selected.subCategories = [];
    }

      // Update form data and selected category
      setFormData((prevData) => ({
          ...prevData,
          category: selected ? selected.name : "",
      }));

      
      // Set the selected category
      setSelectedCategory(selected);
  };

  
  // const handleCateogorySelect = (category) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     category: category || "",
  //   }));
    
  //   setSelectedCategory(categories.find((c) => {return c.shortForm === category}));

  // };

  const handleSubCateogorySelect = (subCategory) => {
    setFormData((prevData) => ({
      ...prevData,
      subCategory: subCategory || "",
    }));
  };
  const handleVatTypeSelect = (shortForm) => {
    const selectedVat = vat.find((v) => v.shortForm === shortForm);

    setFormData((prevData) => ({
      ...prevData,
      vatType: selectedVat ? selectedVat.Vatpercentage : "",
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // await addTestProducts();
    // return;
    const { id, ...productDetails } = formData;
    if (mode === "add") {
      if (file) {
        const picture = await saveImageAsBase64(file);
        productDetails.picture = picture;
      }
      const id = await addProduct(productDetails);
      if (id) alert("Product Added Successfully");
    } else if (mode === "edit") {
      if (file) {
        const picture = await saveImageAsBase64(file);
        productDetails.picture = picture;
      }
      await updateProduct(id, productDetails);
      alert("Product Updated Successfully");
    } else if (mode === "delete") {
      await deleteProduct(id);
      alert("Product Deleted Successfully");
    }
    if (cb) cb();
    // if (handleActionChange) handleActionChange("none");
    setFormData(initialFormData);
    setFile(null);
  };
  const handleAppliedModelChange = (appliedModels) => {
    setFormData((prevData) => ({
      ...prevData,
      appliedModels: appliedModels,
    }));
  };
  const handleAlternativeChange = (alternatives) => {
    setFormData((prevData) => ({
      ...prevData,
      alternatives: alternatives,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-[92vh] ">
      <div className="w-[100%]  mx-auto mt-4">
        {/*  first ROW Form */}
        <div className="flex justify-between  py-10 px-2 shadow-lg">
          <div className="flex flex-col gap-2 w-[45%] ">
            {/* Branch + Name */}
            <div className="flex w-full ">
              <div className="w-1/4 flex items-center">
                <span className="w-1/2  text-right inline-block">Branch:</span>
                <input
                  type="number"
                  name="branch"
                  value={1}
                  onChange={handleInputChange}
                  className="w-1/2 h-7 px-1 border  border-gray-600 ml-1"
                  disabled
                />
              </div>
              <div className="w-3/4 flex items-center">
                <span className="w-1/4 text-right inline-block">Name:</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="uppercase  w-3/4 h-7 border px-1 border-gray-600 ml-1"
                  disabled={isModeDelete}
                />
              </div>
            </div>

            {/* Brand + Product Code */}
            <div className="flex w-full">
              <div className="relative w-1/4 flex items-center">
                <span className="w-1/2 text-right mr-[2px] inline-block">
                  Brand:
                </span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand || ""}
                    className={`${
                      mode == "edit" || mode == "add" ? "bg-white" : ""
                    } w-full px-2 h-7   border border-gray-600`}
                    disabled
                  />
                  {!isModeDelete && (
                    <Popup
                      items={brands}
                      onSelect={handleBrandSelect}
                      style={{ top: "top-1 left-[75%]" }}
                      columns={[
                        { key: "shortForm", label: "Brand Id" },
                        { key: "name", label: "Name" },
                      ]}
                    />
                  )}
                </div>
              </div>
              <div className="w-3/4 flex items-center">
                <span className="2xl:w-1/4 w-1/2 text-right inline-block">
                  Product Code:
                </span>
                <input
                  type="text"
                  name="productCode"
                  value={formData.productCode}
                  onChange={handleInputChange}
                  className="uppercase w-3/4 h-7  border px-1 border-gray-600 ml-1"
                  disabled={isModeDelete}
                />
              </div>
            </div>

            {/* Description */}
            <div className="w-full flex items-center">
              <span className="w-[12.5%]  text-left inline-block">
                Description:&nbsp;
              </span>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className=" w-[87.5%] h-7  border px-1 border-gray-600 ml-1"
                disabled={isModeDelete}
              />
            </div>

            {/* Description 2 */}
            <div className="w-full flex items-center">
              <span className="w-[15%]  text-left inline-block ">
                Description2:
              </span>
              <input
                type="text"
                name="description2"
                value={formData.description2}
                onChange={handleInputChange}
                className=" w-[85%] h-7 border px-1  border-gray-600 "
                disabled={isModeDelete}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 w-[45%]">
            {/* Department + Class */}
            <div className="flex w-full  justify-between">
              <div className="w-[45%] flex items-center">
                <span className="w-[40%] text-right inline-block">
                  Department:
                </span>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="flex-1 h-7 px-1 border  border-gray-600 ml-1"
                  disabled={isModeDelete}
                />
              </div>
              <div className="w-[45%] flex items-center">
                <span className="w-[40%] text-right inline-block">Class:</span>
                <input
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="uppercase flex-1 h-7  border px-1 border-gray-600 ml-1"
                  disabled={isModeDelete}
                />
              </div>
            </div>

            {/* Category + SubCategory */}
            <div className="flex w-full  justify-between">
              <div className=" relative w-[45%] flex items-center">
                <span className="w-[40%] text-right inline-block">
                  Category:
                </span>
                <input
                  type="text"
                  name="category"
                  value={formData.category || ""}
                  className={` ${
                    mode == "edit" || mode == "add" ? "bg-white" : ""
                  } flex-1 h-7 px-1 border border-gray-600 ml-1 `}
                  disabled
                />
                {!isModeDelete && (
                  <Popup
                    items={categories}
                    onSelect={handleCateogorySelect}
                    style={{ top: "top-1 left-[92%]" }}
                    columns={[
                      { key: "shortForm", label: "Category Id" },
                      { key: "name", label: "Category Name" },
                    ]}
                  />
                )}
              </div>
              <div className="w-[45%] relative flex items-center">
                <span className="w-[40%] text-right inline-block">
                  Sub.Category:
                </span>
                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory || ""}
                  disabled
                  className={` ${
                    mode == "edit" || mode == "add" ? "bg-white" : ""
                  } flex-1 h-7 px-1 border border-gray-600 ml-1 `}
                />
                {
                !isModeDelete && (
                  <Popup
                    items={
                      selectedCategory ? selectedCategory.subCategories : []
                    }
                    onSelect={handleSubCateogorySelect}
                    style={{ top: "top-1 left-[94%]" }}
                    columns={[
                      { key: "shortForm", label: "Sub Category Id" },
                      { key: "name", label: "Category Name" },
                    ]}
                  />
                )}
              </div>
            </div>

            {/* BasicUnit + Unique ID */}
            <div className="flex w-full  justify-between">
              <div className="w-[45%] flex items-center">
                <span className="w-[40%] text-right inline-block">
                  Basic Unit:
                </span>
                <input
                  type="text"
                  name="basicUnit"
                  value={formData.basicUnit}
                  onChange={handleInputChange}
                  className="flex-1 h-7      px-1 border border-gray-600 ml-1"
                  disabled={isModeDelete}
                />
              </div>
              <div className="w-[45%] flex items-center">
                <span className="w-[40%] text-right inline-block">
                  UniqueID:
                </span>
                <input
                  type="text"
                  name="uniqueId"
                  value={formData.uniqueId}
                  onChange={handleInputChange}
                  className="uppercase      flex-1 h-7 border px-1 border-gray-600 ml-1"
                  disabled={isModeDelete}
                />
              </div>
            </div>

            {/* Status + Copy In Branches */}
            <div className="flex w-full  justify-between">
              <div className="w-[45%] flex items-center">
                <span className="w-[40%] text-right inline-block">Status:</span>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="flex-1 h-7      px-1 border border-gray-600 ml-1"
                  disabled={isModeDelete}
                />
              </div>
              <div className="w-[45%] flex items-center">
                <span className="w-[40%] text-right inline-block">
                  Copy In Branches:
                </span>
                <select
                  name="copyAllBranch"
                  value={formData.copyAllBranch}
                  onChange={handleInputChange}
                  className="uppercase      flex-1 h-7 border px-1 border-gray-600 ml-1"
                  disabled={isModeDelete}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* General */}
        <div className="py-5 px-2  shadow-lg mt-6 ">
          <h1 className="ml-4 text-lg font-medium">General</h1>

          <div className="w-[95%] mx-auto mt-5  flex gap-2 flex-wrap">
            {/* Selling Price 1 */}
            <div className="w-[30%] flex items-center ">
              <span className="w-[40%] text-right inline-block">
                Selling Price 1:
              </span>
              <input
                type="number"
                name="sellingPrice1"
                value={formData.sellingPrice1}
                onChange={handleInputChange}
                className="flex-1 h-7 px-1 border       border-gray-600 ml-1"
                disabled={isModeDelete}
              />
            </div>

            {/* Reorder */}
            <div className="w-[30%] flex items-center ">
              <span className="w-[40%] text-right inline-block">Re-Order:</span>
              <input
                type="number"
                name="reOrder"
                value={formData.reOrder}
                onChange={handleInputChange}
                className="flex-1 h-7 px-1 border      border-gray-600 ml-1"
                disabled={isModeDelete}
              />
            </div>

            {/* Origin */}
            <div className="w-[30%] flex items-center">
              <span className="w-[40%] text-right inline-block">Origin:</span>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                className="flex-1 h-7 px-1 border       border-gray-600 ml-1"
                disabled={isModeDelete}
              />
            </div>

            {/* SellingPrice 2 */}
            <div className="w-[30%] flex items-center ">
              <span className="w-[40%] text-right inline-block">
                Selling Price 2:
              </span>
              <input
                type="number"
                name="sellingPrice2"
                value={formData.sellingPrice2}
                onChange={handleInputChange}
                className="flex-1 h-7 px-1 border       border-gray-600 ml-1"
                disabled={isModeDelete}
              />
            </div>

            {/* MinOrder */}
            <div className="w-[30%] flex items-center ">
              <span className="w-[40%] text-right inline-block">
                Min-Order:
              </span>
              <input
                type="number"
                name="minOrder"
                value={formData.minOrder}
                onChange={handleInputChange}
                className="flex-1 h-7 px-1 border      border-gray-600 ml-1"
                disabled={isModeDelete}
              />
            </div>

            {/* HScode */}
            <div className="w-[30%] flex items-center ">
              <span className="w-[40%] text-right inline-block">HS code:</span>
              <input
                type="text"
                name="hsCode"
                value={formData.hsCode}
                onChange={handleInputChange}
                className="flex-1 h-7 px-1 border  border-gray-600 ml-1     "
                disabled={isModeDelete}
              />
            </div>

            {/* SellingPrice 3 */}

            <div className="w-[30%] flex items-center ">
              <span className="w-[40%] text-right inline-block">
                Selling Price 3:
              </span>
              <input
                type="number"
                name="sellingPrice3"
                value={formData.sellingPrice3}
                onChange={handleInputChange}
                className="flex-1 h-7 px-1 border  border-gray-600 ml-1     "
                disabled={isModeDelete}
              />
            </div>

            {/* Max Order */}

            <div className="w-[30%] flex items-center ">
              <span className="w-[40%] text-right inline-block">
                Max-Order:
              </span>
              <input
                type="number"
                name="maxOrder"
                value={formData.maxOrder}
                onChange={handleInputChange}
                className="flex-1 h-7 px-1 border  border-gray-600 ml-1     "
                disabled={isModeDelete}
              />
            </div>

            {/* BarCode */}

            <div className="w-[30%] flex items-center ">
              <span className="w-[40%] text-right inline-block">Bar Code:</span>
              <input
                type="number"
                name="barCode"
                value={formData.barCode}
                onChange={handleInputChange}
                className="flex-1 h-7      px-1 border  border-gray-600 ml-1"
                disabled={isModeDelete}
              />
            </div>

            {/* Picture */}

            <div className="w-[30%] flex items-center flex-col">
              <div className="flex justify-between w-[100%]">
                <span className="w-[40%] text-right inline-block">
                  Picture:
                </span>
                <input
                  type="file"
                  name="picture"
                  // value={file}
                  onChange={handleFileChange}
                  className="flex-1 h-7      px-1 border  border-gray-600 ml-1"
                  disabled={isModeDelete}
                />
              </div>
              {formData.picture && <p>{getFileName(formData.picture)}</p>}
            </div>

            {/*ShelfLife */}

            <div className="w-[30%] flex items-center ">
              <span className="w-[40%] text-right inline-block">
                Shelf Life:
              </span>
              <input
                type="text"
                name="shelfLife"
                value={formData.shelfLife}
                onChange={handleInputChange}
                className="flex-1 h-7      px-1 border  border-gray-600 ml-1"
                disabled={isModeDelete}
              />
            </div>

            {/*Vat Type */}

            <div className="w-[30%] relative flex items-center ">
              <span className="w-[40%] text-right inline-block">Vat type:</span>
              <input
                type="text"
                name="vatType"
                value={formData.vatType}
                disabled
                className={` ${
                  mode == "edit" || mode == "add" ? "bg-white" : ""
                } flex-1 h-7      px-1 border  border-gray-600 ml-1 `}
              />
              {!isModeDelete && (
                <Popup
                  items={vat}
                  onSelect={handleVatTypeSelect}
                  style={{ top: "top-1 left-[94%]" }}
                  columns={[
                    { key: "shortForm", label: "VAT Code" },
                    { key: "Description", label: "Description" },
                    { key: "Vatpercentage", label: "VAT Percentage" },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
        {/* Tables */}
        <div className="mt-8 flex">
          <div className="w-[70%] min-h-36 ">
            <Table
              data={tableData}
              columns={[
                { key: "unit", header: "Unit" },
                { key: "Fraction", header: "Fraction" },
                { key: "GWeight", header: "Gross Weight" },
                { key: "NetWeight", header: "Net Weight" },
                { key: "length", header: "Length" },
                { key: "height", header: "Height" },
                { key: "breadth", header: "Breadth" },
                { key: "volume", header: "Volume" },
                { key: "packingSize", header: "Packing Size" },
                { key: "ID", header: "ID" },
              ]}
              highlightColumn={"unit"}
              name={"Details"}
            />
          </div>

          <div className="w-[30%]">
            <AppliedModel
              Alternative={initialProduct.alternatives}
              AppliedModel={initialProduct.appliedModels}
              onAlternativeChange={handleAlternativeChange}
              onAppliedModelChange={handleAppliedModelChange}
              categories={categories}
            />
          </div>
        </div>

        {!(Object.keys(initialProduct).length === 0 && mode === "delete") && (
          <button
            type="submit"
            onClick={handleSubmit}
            className="  bg-white   px-5 py-1 w-full  border border-gray-100 mt-2"
          >
            {mode} product{" "}
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductMastery;

/**
 *
 * @param {string} filePath
 * @returns
 */
function getFileName(filePath) {
  // Split the filePath by the backslash character
  const parts = filePath.split("\\");
  // Return the last part of the array
  const fileName = parts[parts.length - 1];

  const s = fileName.split(";");
  return s[s.length - 1];
}
