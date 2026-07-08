import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DynamicIcon } from "@/components/shared/DynamicIcon";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  emptyMessage?: string;
}

export function DataTable<TData>({ columns, data, emptyMessage = "No records found." }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                className={header.column.getCanSort() ? "cursor-pointer select-none" : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: <DynamicIcon name="chevron-down" className="h-3 w-3 rotate-180" />,
                    desc: <DynamicIcon name="chevron-down" className="h-3 w-3" />,
                  }[header.column.getIsSorted() as string] ?? null}
                </span>
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={columns.length} className="py-8 text-center text-ink-400">
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
