import React, { useEffect, useState } from "react";
import Table from "./Table";
import { addArea, getAllAreas } from "../../db/area";

import { ref, set } from "firebase/database"; // Importing necessary methods
import { database } from "../firebase"; // Import your initialized Firebase database instance


/**
 * @typedef {import('../../db/area').Area} Area
 */

const initialFormData = {
  name: "",
  shortForm: "",
};

const AddArea = () => {
  const [formData, setFormData] = useState(initialFormData);

  /**
   * @type {[Area[], Function]}
   */
  const [areas, setAreas] = useState([]);
  const fetchData = async () => {
    const data = await getAllAreas();
    setAreas(data);
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
    const areaExists = areas.some((area) => {
      return (
        area.shortForm.toLowerCase() === formData.shortForm.toLowerCase() ||
        area.name.toLowerCase() === formData.name.toLowerCase()
      );
    });

    if (areaExists) return alert("This area already exists.");

    await addArea(formData);
    setFormData(initialFormData);
    await fetchData();
  };

  const handleDelete = (brandId) => {
    // Add your delete logic here
    console.log("Deleting brand with ID: ${brandId}" + brandId);
    // Example: Call an API or update the state to remove the brand
  };

  return (
    <div className="min-h-[100vh]">
      <h1 className="text-center relative top-10  text-3xl">Add Area</h1>

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
            <span>Enter Shortform:</span>
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
        <div className="w-[80%] mx-auto mt-16 h-[40vh]">
          <Table
            name={"Available Areas"}
            data={areas}
            columns={[
              { key: "name", header: "Area Name" },
              { key: "shortForm", header: "Short Form" },
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

export default AddArea;
