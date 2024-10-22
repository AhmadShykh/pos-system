import React, { useEffect, useState } from "react";
import Table from "./Table";
import Popup from "./Popup";
import { getAllCategories, addSubCategory, getAllSubCategories } from "../../db/category"; // Import necessary functions

/**
 * @typedef {import('../../db/category').Category} Category
 * @typedef {import('../../db/category').SubCategory} SubCategory
 */

const initialFormData = {
  name: "",
  shortForm: "",
  category: "",
};

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]); // State for subcategories

  const fetchData = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  const fetchSubCategories = async () => {
    const data = await getAllSubCategories(); // Fetch all subcategories
    setSubCategories(data); // Set all subcategories from database
  };

  useEffect(() => {
    fetchData();
    fetchSubCategories(); // Fetch subcategories when the component loads
  }, []);

  const handleCategorySelect = (item) => {
    setSelectedCategory(item);
    setFormData((prevData) => ({
      ...prevData,
      category: item.name,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return alert("Please select a category first");

    const newSubCategory = {
      name: formData.name,
      shortForm: formData.shortForm,
    };

    // Add the new subcategory to the database
    await addSubCategory(selectedCategory.id, newSubCategory);

    // Update the state to reflect the new subcategory
    setSubCategories((prev) => [...prev, newSubCategory]);

    // Reset the form data
    setFormData(initialFormData);
  };

  const handleDelete = (brandId) => {
    // Add your delete logic here
    console.log("Deleting brand with ID: ${brandId}" + brandId);
    // Example: Call an API or update the state to remove the brand
  };

  return (
    <div className="min-h-[100vh]">
      <h1 className="text-center relative top-10 text-3xl">Add Sub-Category</h1>

      <form className="mt-28" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-5 w-[80%] mx-auto">
          <div className="col-span-1">
            <span>Enter Name:</span>
            <input
              type="text"
              name="name"
              className="ml-1 px-2"
              onChange={handleInputChange}
              required
              value={formData.name || ""}
            />
          </div>

          <div className="col-span-1">
            <span>Enter ID:</span>
            <input
              type="text"
              name="shortForm"
              className="ml-1 px-2"
              onChange={handleInputChange}
              required
              value={formData.shortForm || ""}
            />
          </div>

          <div className="relative col-span-1 -left-6">
            <span className="w-[29%] border inline-block">Enter Category:</span>
            <input
              type="text"
              className="ml-1 px-2 bg-white"
              value={selectedCategory ? selectedCategory.name : ""}
              disabled
            />
            <Popup
              items={categories}
              columns={[
                { key: "shortForm", label: "Category ID" },
                { key: "name", label: "Category Name" },
              ]}
              all={true}
              onSelect={handleCategorySelect}
              style={{ top: "top-[5px] left-[76%]" }}
            />
          </div>
        </div>

        <div className="w-[80%] mx-auto mt-12">
          <Table
            name={"Details"}
            data={subCategories.length > 0 ? subCategories : [{ name: "No results found", shortForm: "" }]} // Show "No results found" if no subcategories
            columns={[
              { key: "shortForm", header: "SubCategory Id" },
              { key: "name", header: "SubCategory Name" },
              {
                key: "delete",
                header: "Delete",
                render: (row) => (
                  <button type="button" onClick={() => handleDelete(row.shortForm)}>Delete</button>
                ),
              },
            ]}
          />
        </div>

        <div className="w-[80%] mx-auto mt-10">
          <button
            type="submit"
            className="bg-white border border-gray-300 w-full py-1 px-3"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
