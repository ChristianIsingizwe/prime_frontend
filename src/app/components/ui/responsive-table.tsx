"use client";

import { useState } from "react";
import { cn } from "../../lib/utils";

export interface Column<T> {
  header: string;
  key: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
  hideOnMobile?: boolean;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  enableRowSelection?: boolean;
  defaultRowsPerPage?: number;
  uniqueKey?: string;
  className?: string;
}

export function ResponsiveTable<T>({
  data,
  columns,
  enableRowSelection = true,
  defaultRowsPerPage = 5,
  uniqueKey = "id",
  className,
}: ResponsiveTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      const allIds = data.map((item: any) => item[uniqueKey]);
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

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  // Only show non-mobile hidden columns in the desktop view
  const visibleDesktopColumns = columns.filter((col) => !col.hideOnMobile);
  // For mobile view, get a few essential columns
  const visibleMobileColumns = columns
    .filter((col) => !col.hideOnMobile)
    .slice(0, 2);

  return (
    <div className={cn("", className)}>
      {/* Desktop table view */}
      <div className="hidden sm:block overflow-x-auto">
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
                <th
                  key={col.key}
                  className={cn(
                    "p-3 text-left",
                    col.hideOnMobile && "hidden md:table-cell"
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => {
              // Use the row id or index as key
              const rowId = (row as any)[uniqueKey] || index;
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
                        checked={selectedRows.includes(rowId)}
                        onChange={() => toggleSelectRow(rowId)}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "p-3",
                        col.hideOnMobile && "hidden md:table-cell"
                      )}
                    >
                      {col.render
                        ? col.render(row)
                        : col.accessor
                        ? String(row[col.accessor])
                        : null}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards view */}
      <div className="sm:hidden">
        {paginatedData.map((row, index) => {
          const rowId = (row as any)[uniqueKey] || index;
          return (
            <div
              key={rowId}
              className={cn(
                "mb-4 rounded-lg border overflow-hidden",
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              )}
            >
              <div className="p-4">
                {enableRowSelection && (
                  <div className="mb-2 flex justify-end">
                    <input
                      type="checkbox"
                      className="h-5 w-5"
                      checked={selectedRows.includes(rowId)}
                      onChange={() => toggleSelectRow(rowId)}
                    />
                  </div>
                )}

                {columns.map((col) => (
                  <div
                    key={col.key}
                    className={cn("py-2", col.hideOnMobile && "hidden")}
                  >
                    <div className="font-semibold text-gray-700">
                      {col.header}
                    </div>
                    <div>
                      {col.render
                        ? col.render(row)
                        : col.accessor
                        ? String(row[col.accessor])
                        : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination - works for both views */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm gap-4">
        {enableRowSelection && (
          <div>
            {selectedRows.length} of {data.length} row(s) selected
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4">
          <div className="flex items-center">
            <span className="mr-2">Rows per page:</span>
            <select
              className="border rounded p-1"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div>
            Page {currentPage} of {totalPages || 1}
          </div>
          <div className="flex">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border px-2 py-1 rounded-l disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="border-t border-r border-b px-2 py-1 rounded-r disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
