import React from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (row: T) => React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "No records found matching criteria.",
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto border border-outline-variant rounded-sm bg-white shadow-sm", className)}>
      <table className="w-full text-left border-collapse text-xs">
        <thead className="sticky top-0 bg-primary-container text-white z-10">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={cn(
                  "py-2.5 px-3 font-label-caps uppercase text-[11px] tracking-wider font-semibold border-b border-surface-tint",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant font-sans">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-8 text-center text-on-surface-variant font-medium text-xs bg-surface-container-lowest"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  "zebra-row transition-colors",
                  rowIdx % 2 === 0 ? "bg-white" : "bg-[#f8fafc]",
                  onRowClick && "cursor-pointer hover:bg-secondary-container/20"
                )}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={cn(
                      "py-2 px-3 text-on-surface whitespace-nowrap",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      col.className
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : col.accessorKey
                      ? String(row[col.accessorKey] ?? "")
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
