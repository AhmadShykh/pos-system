import React, { useEffect, useState } from "react";
import Table from "./Table";
import { addCategory, getAllCategories,deleteCategoryByName } from "../../db/category";

const initalFormData = {
  name: "",
  shortForm: "",
};

const AddCategory = () => {
  const [formData, setFormData] = useState(initalFormData);
  const [categories, setCategories] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchData = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Checking if the category already exists
    const categoryExists = categories.some(
      (category) =>
        category.shortForm.toLowerCase() === formData.shortForm.toLowerCase()
    );

    if (categoryExists) {
      alert("This category already exists.");
      return;
    }

    // Adding the new category
    const id = await addCategory(formData);
    fetchData();
    if (id) setFormData(initalFormData);
  };

 
  // Delete handler
  const handleDelete = async (e, categoryName) => {
    e.preventDefault(); // Prevent default form or button behavior
    try {
      await deleteCategoryByName(categoryName) // Call the delete function with the brandId
      await fetchData(); // Re-fetch data to update state after deletion
      console.log(`Deleting Category with ID: ${categoryName}`);
    } catch (error) {
      console.error("Error deleting Category:", error);
    }
  };

  return (
    <div className="min-h-[100vh]">
      <h1 className="text-center relative top-10  text-3xl">Add Category</h1>

      <form className=" mt-28" onSubmit={handleSubmit}>
        <div className="flex justify-between w-[80%] mx-auto">
          <div className="">
            <span>Enter Name:</span>
            <input
              type="text"
              name="name"
              className="ml-1 px-2"
              onChange={handleInputChange}
              required
              value={formData.name}
            />
          </div>
          <div className="">
            <span>Enter ID:</span>
            <input
              type="text"
              name="shortForm"
              className="ml-1 px-2"
              onChange={handleInputChange}
              required
              value={formData.shortForm}
            />
          </div>
        </div>
        <div className="w-[80%] mx-auto mt-16">
          <Table
            name={"Available Categories"}
            data={categories}
            columns={[
              { key: "shortForm", header: "Category Id" },
              { key: "name", header: "Category Name" },
              {
                key: "delete",
                header: "Delete",
                render: (row) => (
                  <button type="button" onClick={(e) => handleDelete(e,row.shortForm)}>Delete</button>
                ),
              },
            ]}
          />
        </div>

        <div className="w-[80%] mx-auto mt-4">
          <button
            type="submit"
            className="bg-white border border-gray-300 w-full  py-1 px-3 "
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
