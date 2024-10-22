import React, { useState, useEffect } from "react";
import Popup from "./Popup";
import addIcon from "../Assets/add.png";
import MachineProductSelector from "./MachineProductSearch";

const AppliedModel = ({
  AppliedModel,
  Alternative,
  mode,
  onAlternativeChange,
  onAppliedModelChange,
  categories,
}) => {
  const [appliedModels, setAppliedModels] = useState([]);
  const [alternatives, setAlternatives] = useState([]);
  const [currentList, setCurrentList] = useState("alternative"); // 'applied' or 'alternative'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (AppliedModel) {
      setAppliedModels(AppliedModel);
    }
    if (Alternative) {
      setAlternatives(Alternative);
    }
  }, [AppliedModel, Alternative]);

  // Use useEffect to sync state changes to parent
  useEffect(() => {
    onAppliedModelChange(appliedModels);
  }, [appliedModels]);

  useEffect(() => {
    onAlternativeChange(alternatives);
  }, [alternatives]);

  /**
   *
   * @param {import("../../db/products").Product} selectedProduct
   */
  const handleProductSelect = (selectedProduct) => {
    // TODO: add quantity here
    const { productCode, brand, name, sellingPrice1 } = selectedProduct;
    setAlternatives((prevAlternatives) => [
      ...prevAlternatives,
      { productCode, brand, name, sellingPrice1 },
    ]);
    setIsModalOpen(false);
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    if (currentList === "applied") {
      const newAppliedModel = {
        make: "",
        type: "",
        remarks: "",
      };
      setAppliedModels((prevAppliedModels) => [
        ...prevAppliedModels,
        newAppliedModel,
      ]);
      setSubCategories((prev) => [...prev, []]);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = (index, type) => {
    if (type === "applied") {
      setAppliedModels((prevAppliedModels) =>
        prevAppliedModels.filter((_, idx) => idx !== index)
      );
      setSubCategories((prev) => prev.filter((_, idx) => idx !== index));
    } else {
      setAlternatives((prevAlternatives) =>
        prevAlternatives.filter((_, idx) => idx !== index)
      );
    }
  };

  const handleListChange = (listType) => {
    setCurrentList(listType);
  };

  const handleInputChange = (index, field, value) => {
    setAppliedModels((prevAppliedModels) =>
      prevAppliedModels.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleCategorySelect = (index, selectedCategory) => {
    handleInputChange(index, "type", selectedCategory.shortForm);
  };
  const handleSubCategorySelect = (index, selectedSubCategory) => {
    setSubCategories((prev) =>
      prev.map((item, idx) =>
        idx === index ? selectedSubCategory.subCategories : item
      )
    );
    handleInputChange(index, "make", selectedSubCategory.shortForm);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full flex flex-col">
      <div className="flex justify-center gap-2">
        <button
          onClick={() => handleListChange("applied")}
          className="px-6 py-1 text-sm bg-white border border-gray-300"
          type="button"
        >
          Applied Model
        </button>
        <button
          onClick={() => handleListChange("alternative")}
          className="px-6 py-1 text-sm bg-white border border-gray-300"
          type="button"
        >
          Alternative
        </button>
        <button
          onClick={handleAddClick}
          className="px-3 bg-white border border-gray-300 text-sm"
          type="button"
        >
          <img src={addIcon} alt="" className="w-6 h-6" />
        </button>
      </div>

      {currentList === "applied" && (
        <div className="min-h-32 bg-blue-100 mt-2 ml-2">
          <table className="w-full">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="px-2 py-1 text-sm bg-yellow-200 font-bold italic text-black">
                  Make
                </th>
                <th className="px-2 py-1 text-sm">Type</th>
                <th className="px-1 py-1 text-sm font-normal">Remarks</th>
                <th className="py-1 text-sm font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appliedModels.map((item, index) => (
                <tr key={index}>
                  <td className="border text-sm relative">
                    <div className="px-1 py-1 text-xs w-full h-full whitespace-nowrap overflow-hidden text-ellipsis">
                      <input
                        type="text"
                        value={
                          item.make.length > 6
                            ? item.make.substring(0, 6) + "..."
                            : item.make
                        }
                        className="w-full py-1 px-1 h-full outline-none bg-white"
                        disabled={mode === "delete" || true}
                        title={item.make} // Shows full text on hover
                      />
                    </div>
                    {!(mode === "delete") && (
                      <Popup
                        items={categories}
                        onSelect={(selectedSubCategory) =>
                          handleSubCategorySelect(index, selectedSubCategory)
                        }
                        columns={[
                          { key: "shortForm", label: "Category ID" },
                          { key: "name", label: "Category Name" },
                        ]}
                        style={{ top: "top-4 left-[78%]" }}
                        all={true}
                      />
                    )}
                  </td>
                  <td className="border text-sm relative">
                    <div className="px-1 py-1 text-xs w-full h-full whitespace-nowrap overflow-hidden text-ellipsis">
                      <input
                        type="text"
                        value={
                          item.type.length > 6
                            ? item.type.substring(0, 6) + "..."
                            : item.type
                        }
                        className="w-full py-1 px-1 h-full outline-none bg-white"
                        disabled={mode === "delete"}
                        title={item.type} // Shows full text on hover
                      />
                    </div>
                    {!(mode === "delete") && (
                      <Popup
                        items={subCategories[index] || []}
                        onSelect={(selectedCategory) =>
                          handleCategorySelect(index, selectedCategory)
                        }
                        columns={[
                          { key: "name", label: "Category Name" },
                          { key: "shortForm", label: "Short Form" },
                        ]}
                        style={{ top: "top-4 left-[78%]" }}
                        all={true}
                      />
                    )}
                  </td>

                  <td className="px-4 py-2 border text-sm">
                    <input
                      type="text"
                      value={item.remarks}
                      onChange={(e) =>
                        handleInputChange(index, "remarks", e.target.value)
                      }
                      className="  px-2 py-1 text-sm w-full bg-transparent outline-none focus:bg-white"
                      disabled={mode === "delete"}
                    />
                  </td>
                  <td className="px-4 py-2 border text-sm">
                    <button
                      onClick={() => handleDeleteClick(index, "applied")}
                      className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {currentList === "alternative" && (
        <div className="min-h-32 bg-blue-100 mt-2 ml-2">
          <table className="w-full">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="px-2 border text-sm bg-orange-400 font-normal">
                  Alternate Id
                </th>
                <th className="px-1 border text-sm font-normal">Brand</th>
                <th className="border text-sm font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alternatives.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-1 border text-sm border-r-gray-300 border-r-2">
                    {item.productCode}
                  </td>
                  <td className="px-4 py-1 border text-sm border-r-gray-300 border-r-2">
                    {item.brand}
                  </td>
                  <td className="px-4 py-1 border text-sm border-r-gray-300 border-r-2">
                    <button
                      onClick={() => handleDeleteClick(index, "alternative")}
                      className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {currentList === "alternative" && isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center ">
          <div className="p-4 rounded shadow-lg max-w-[95vw] min-w-[95vw] bg-background  ">
            <button className="text-red-500 mb-2" onClick={handleCloseModal}>
              Close
            </button>
            <MachineProductSelector onProductSelect={handleProductSelect} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedModel;
