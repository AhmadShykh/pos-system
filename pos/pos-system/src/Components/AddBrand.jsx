import React, { useEffect, useState } from "react";
import Table from "./Table";
import { addBrand, getAllBrands } from "../../db/brands";

/**
 * @typedef {import('../../db/brands').Brand} Brand
 */

const initialFormData = {
  name: "",
  shortForm: "",
};

const AddBrand = () => {
  const [formData, setFormData] = useState(initialFormData);
  /**
   * @type {[Brand[], Function]}
   */
  const [brands, setBrands] = useState([]);
  const fetchData = async () => {
    const brands = await getAllBrands();
    setBrands(brands);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const brandExists = brands.some(
      (brand) =>
        brand.shortForm.toLowerCase() === formData.shortForm.toLowerCase()
    );

    if (brandExists) return alert("This brand already exists.");
    await addBrand(formData);
    setFormData(initialFormData);
    fetchData();
  };
  const handleDelete = (brandId) => {
    // Add your delete logic here
    console.log("Deleting brand with ID: ${brandId}" + brandId);
    // Example: Call an API or update the state to remove the brand
  };

  return (
    <div className="min-h-[100vh]">
      <h1 className="text-center relative top-10  text-3xl">Add Brand</h1>

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
            name={"Available Areas"}
            data={brands}
            columns={[
              { key: "shortForm", header: "Brand Id" },
              { key: "name", header: "Brand Name" },
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

export default AddBrand;
