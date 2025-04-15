"use client";

import { useState } from "react";

export interface Column<T> {
  header: string;
  key: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  enableRowSelection?: boolean;
  defaultRowsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export function GenericTable<T>({
  data,
  columns,
  enableRowSelection = true,
  defaultRowsPerPage = 5,
  currentPage: externalCurrentPage,
  totalPages: externalTotalPages,
  onPageChange,
  isLoading = false,
}: GenericTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Use external pagination if provided, otherwise use internal state
  const currentPage = externalCurrentPage ?? internalCurrentPage;
  const totalPages = externalTotalPages ?? Math.ceil(data.length / rowsPerPage);

  const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      const allIds = data.map((item: any) => item.id);
      setSelectedRows(allIds);
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#2A5470B2] text-white">
              {enableRowSelection && (
                <th className="p-3 text-left w-10">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={
                      selectedRows.length === data.length && data.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} className="p-3 text-left">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                  className="p-4 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                  className="p-4 text-center"
                >
                  No data available
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const rowId = (row as any).id || index;
                return (
                  <tr
                    key={rowId}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    {enableRowSelection && (
                      <td className="p-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={selectedRows.includes((row as any).id)}
                          onChange={() => toggleSelectRow((row as any).id)}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="p-3">
                        {col.render
                          ? col.render(row)
                          : col.accessor
                          ? String(row[col.accessor])
                          : null}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {enableRowSelection && (
          <div>
            {selectedRows.length} of {data.length} row(s) selected
          </div>
        )}
        <div className="flex items-center space-x-4">
          <div>
            Rows per page:
            <select
              className="ml-2 border rounded p-1"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                handlePageChange(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1 || isLoading}
            className="border px-2 py-1 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages || isLoading}
            className="border px-2 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
