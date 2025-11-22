// TableComponent.tsx
// import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  // SortingState,
  Column,
} from "@tanstack/react-table";
// import { ArrowUp, ArrowDown } from "lucide-react";
import { V_DOWN, V_UP } from "../assets";

interface TableData {
  [key: string]: any;
}

interface TableProps {
  DATA: TableData[];
  COLUMNS: Column<TableData>[];
  sorting: any;
  setSorting: any;
}

export default function TableComponent({
  DATA,
  COLUMNS,
  sorting,
  setSorting,
}: TableProps) {
  const table = useReactTable({
    data: DATA,
    columns: COLUMNS,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full inline-block  align-middle">
        <div className="shadow overflow-visible border border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-[#00A63E0D]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, i) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className={`px-4 py-3 text-left text-sm text-primary-300 bg-[#F0FEF8] font-semibold tracking-wider cursor-pointer whitespace-nowrap ${
                        i === 0
                          ? "sticky left-0 z-10 border-r border-borderColor"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: (
                            <img
                              src={V_UP}
                              className="w-[10px] h-[10px]"
                              alt=""
                            />
                          ),
                          desc: (
                            <img
                              src={V_DOWN}
                              className="w-[10px] h-[10px]"
                              alt=""
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {table.getRowModel().rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={`even:bg-gray-50 hover:bg-gray-100 transition-colors duration-150`}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <td
                      key={cell.id}
                      className={`px-4 py-2 whitespace-nowrap overflow-visible ${
                        i === 0
                          ? `sticky left-0 z-[5] ${
                              rowIndex % 2 ? "bg-gray-100" : "bg-white"
                            }  shadow-[4px_0_6px_-4px_rgba(0,0,0,0.1)] border-r border-gray-200`
                          : ""
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
