import React from "react";
import "../Assets/scrollbar.css";

const Table = ({
  name,
  data,
  columns,
  highlightColumn,
  height,
  handleRowClick,
}) => {
  const truncateText = (text) => {
    if (typeof text !== "string") {
      return text;
    }

    if (text.length > 13) {
      return text.slice(0, 13) + "...";
    }
    return text;
  };

  // Determine column headers from the columns prop or use an empty array if no columns
  const columnHeaders = columns.length > 0 ? columns : [];

  return (
    <div
      className={`${
        height ? "h-80" : "min-h-full"
      } bg-blue-100 max-h-52 overflow-auto scrollbar`}
    >
      {/* Fixed Header */}
      <div className="bg-gray-500 font-semibold text-sm mb-2 text-white text-center uppercase">
        {name}
      </div>

      {/* Scrollable Table */}
      <div className="max-h-52">
        <table className="w-full ">
          <thead>
            <tr>
              {columnHeaders.map((col, index) => (
                <th
                  key={index}
                  className={`text-left text-sm px-2 py-0 border-r-2 border-r-gray-400 ${
                    index === 0
                      ? "bg-yellow-200 italic font-bold"
                      : "bg-blue-800 text-white font-medium"
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} onClick={() => handleRowClick && handleRowClick(row)}>
                  {columnHeaders.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-2 py-1 font-semibold border-r-2 border-r-gray-300 text-[0.85rem] uppercase whitespace-nowrap ${
                        rowIndex === 0 && col.key === highlightColumn
                          ? "bg-orange-400"
                          : ""
                      }`}
                    >
                      {col.render ? col.render(row) : truncateText(row[col.key]?.toString() || "")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                {columnHeaders.map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-2 py-1 border-r-2 border-r-gray-300 text-[0.85rem] uppercase whitespace-nowrap"
                  >
                    {/* Placeholder text or empty */}
                    {""}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
