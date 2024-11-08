import React, { useState } from "react";
import selectIcon from "../Assets/select.png";

const Popup = ({ items, onSelect, style, columns, all, ICON, name }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleInputClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleValueSelect = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect(!all ? item.shortForm || item.name || item.Name : item);
    
    setIsModalOpen(false);
  };

  const closeModal = (e) => {
    
    e.stopPropagation();
    e.preventDefault();
    setIsModalOpen(false);
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
  };

  // Function to reset date filters
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  // Converting strings to Date objects
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  // Filtering after search and date range
  const filteredItems = items.filter((item) => {
    const matchesSearchTerm = columns.some((col) =>
      String(item[col.key] || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  
    if (name === "invoiceList" && startDate && endDate) {
      const itemDate = parseDate(item.date);
      if (isNaN(itemDate)) return false; // Ignore items with invalid dates
      const from = new Date(startDate);
      const to = new Date(endDate);
      const withinDateRange = itemDate >= from && itemDate <= to;
      return matchesSearchTerm && withinDateRange;
    }
  
    return matchesSearchTerm;
  });
  

  return (
    <div className={`absolute ${style.top} ]`}>
      <button onClick={handleInputClick} type="button">
        <img
          src={ICON || selectIcon}
          className={`${ICON ? "w-6 h-6" : "w-4 h-4"}`}
          alt="Select"
        />
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-background  rounded-lg shadow-lg p-6 w-[50vw] max-w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-center text-blue-800 italic ">
              Select an Item
            </h2>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border py-1 px-2 mb-4 w-full"
              placeholder="Search"
            />
            {name === "invoiceList" && (
              <div className="mb-4 flex items-center">
                <label className="mr-2">
                  From:
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border p-2 mx-2"
                  />
                </label>
                <label>
                  To:
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border p-2 mx-2"
                  />
                </label>
                <button
                  onClick={resetFilters}
                  type="button"
                  className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Reset
                </button>
              </div>
            )}
            <table className="w-full table-auto ">
              <thead className="bg-blue-800 text-white text-sm ">
                <tr className="">
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 font-medium border">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-blue-100 ">
                
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id || item.shortForm}
                      className="cursor-pointer  hover:bg-orange-300"
                      onClick={(e) => handleValueSelect(e, item)}
                    >
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-1 border">
                          {item[col.key] || ""}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-2 text-center"
                    >
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <button
              onClick={closeModal}
              type="button"
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
