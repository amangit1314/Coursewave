// "use client";

// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   SortingState,
//   getSortedRowModel,
//   getPaginationRowModel,
//   ColumnFiltersState,
//   getFilteredRowModel,
//   VisibilityState,
//   useReactTable,
// } from "@tanstack/react-table";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import React from "react";

// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Check, ChevronDown, LayoutGrid, Settings2 } from "lucide-react";

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
// }

// export function DataTable<TData, TValue>({
//   columns,
//   data,
// }: DataTableProps<TData, TValue>) {
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     []
//   );
//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = React.useState({});

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onSortingChange: setSorting,
//     getSortedRowModel: getSortedRowModel(),
//     onColumnFiltersChange: setColumnFilters,
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//   });

//   return (
//     <div className="bg-white space-y-4 dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6">
//       <div className="mx-4 flex items-center py-4">
//         <Input
//           placeholder="Filter emails..."
//           value={table.getColumn("email")?.getFilterValue() as string}
//           onChange={(event) =>
//             table.getColumn("email")?.setFilterValue(event.target.value)
//           }
//           className="max-w-sm"
//         />
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="outline"
//               className="ml-auto border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 shadow-sm hover:shadow-md group"
//             >
//               <Settings2 className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
//               Columns
//               <ChevronDown className="h-4 w-4 ml-2 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             align="end"
//             className="w-64 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl shadow-black/5 p-3"
//           >
//             {/* Header */}
//             <div className="px-2 py-2 border-b border-gray-100 dark:border-gray-800 mb-2">
//               <div className="flex items-center gap-2">
//                 <LayoutGrid className="h-4 w-4 text-gray-600 dark:text-gray-400" />
//                 <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                   Table Columns
//                 </span>
//               </div>
//               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                 Customize visible columns
//               </p>
//             </div>

//             {/* Select All / None */}
//             <div className="flex gap-2 px-2 mb-3">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="h-7 text-xs px-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                 onClick={() => {
//                   table.getAllColumns().forEach((column) => {
//                     if (column.getCanHide()) {
//                       column.toggleVisibility(true);
//                     }
//                   });
//                 }}
//               >
//                 Select All
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="h-7 text-xs px-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                 onClick={() => {
//                   table.getAllColumns().forEach((column) => {
//                     if (column.getCanHide()) {
//                       column.toggleVisibility(false);
//                     }
//                   });
//                 }}
//               >
//                 Reset
//               </Button>
//             </div>

//             {/* Columns List */}
//             <div className="max-h-64 overflow-y-auto space-y-1">
//               {table
//                 .getAllColumns()
//                 .filter((column) => column.getCanHide())
//                 .map((column) => {
//                   const isVisible = column.getIsVisible();
//                   return (
//                     <DropdownMenuCheckboxItem
//                       key={column.id}
//                       checked={isVisible}
//                       onCheckedChange={(value) =>
//                         column.toggleVisibility(!!value)
//                       }
//                       className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 group/item"
//                     >
//                       <div
//                         className={`flex items-center justify-center h-4 w-4 rounded border transition-all duration-200 ${
//                           isVisible
//                             ? "bg-blue-500 border-blue-500 text-white"
//                             : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 group-hover/item:border-blue-300 dark:group-hover/item:border-blue-400"
//                         }`}
//                       >
//                         {isVisible && <Check className="h-3 w-3" />}
//                       </div>

//                       <div className="flex flex-col flex-1 min-w-0">
//                         <span className="text-sm font-medium capitalize">
//                           {column.id
//                             .replace(/([A-Z])/g, " $1")
//                             .replace(/^./, (str) => str.toUpperCase())}
//                         </span>
//                         <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
//                           {isVisible ? "Visible" : "Hidden"}
//                         </span>
//                       </div>

//                       <div
//                         className={`h-2 w-2 rounded-full transition-colors ${
//                           isVisible
//                             ? "bg-green-400"
//                             : "bg-gray-300 dark:bg-gray-600"
//                         }`}
//                       />
//                     </DropdownMenuCheckboxItem>
//                   );
//                 })}
//             </div>

//             {/* Footer Stats */}
//             <div className="px-2 pt-3 mt-2 border-t border-gray-100 dark:border-gray-800">
//               <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
//                 <span>Visible columns</span>
//                 <span className="font-medium text-gray-700 dark:text-gray-300">
//                   {table.getVisibleFlatColumns().length} of{" "}
//                   {
//                     table.getAllColumns().filter((col) => col.getCanHide())
//                       .length
//                   }
//                 </span>
//               </div>
//             </div>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       <Table>
//         <TableHeader>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <TableRow key={headerGroup.id}>
//               {headerGroup.headers.map((header) => {
//                 return (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </TableHead>
//                 );
//               })}
//             </TableRow>
//           ))}
//         </TableHeader>
//         <TableBody>
//           {table.getRowModel().rows?.length ? (
//             table.getRowModel().rows.map((row) => (
//               <TableRow
//                 key={row.id}
//                 data-state={row.getIsSelected() && "selected"}
//               >
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={columns.length} className="h-24 text-center">
//                 No results.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>

//       <div className="mx-4 flex items-center justify-end space-x-2 py-4">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           Previous
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  ChevronDown,
  LayoutGrid,
  Search,
  Settings2,
} from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search across all columns...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="bg-white space-y-6 dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
      {/* Enhanced Header Section */}
      <div className="flex flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Input with Enhanced Styling */}
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/4 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-10 pr-4 py-2.5 w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />

            {/* Search Results Counter */}
            {globalFilter && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full font-medium">
                  {table.getFilteredRowModel().rows.length} results
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Columns Dropdown */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 shadow-sm hover:shadow-md group w-full sm:w-auto h-10"
              >
                <Settings2 className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                Columns
                <ChevronDown className="h-4 w-4 ml-2 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm shadow-xl shadow-black/5 p-3"
            >
              {/* Header */}
              <div className="px-2 py-2 border-b border-gray-100 dark:border-gray-800 mb-2">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Table Columns
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Customize visible columns
                </p>
              </div>

              {/* Select All / None */}
              <div className="flex gap-2 px-2 mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  onClick={() => {
                    table.getAllColumns().forEach((column) => {
                      if (column.getCanHide()) {
                        column.toggleVisibility(true);
                      }
                    });
                  }}
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  onClick={() => {
                    table.getAllColumns().forEach((column) => {
                      if (column.getCanHide()) {
                        column.toggleVisibility(false);
                      }
                    });
                  }}
                >
                  Reset
                </Button>
              </div>

              {/* Columns List - Custom Implementation */}
              <div className="max-h-64 overflow-y-auto space-y-1">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    const isVisible = column.getIsVisible();
                    return (
                      <div
                        key={column.id}
                        onClick={() => column.toggleVisibility(!isVisible)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 group/item"
                      >
                        {/* Custom Checkbox */}
                        <div
                          className={`flex items-center justify-center h-4 w-4 rounded border transition-all duration-200 ${
                            isVisible
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 group-hover/item:border-blue-300 dark:group-hover/item:border-blue-400"
                          }`}
                        >
                          {isVisible && <Check className="h-3 w-3" />}
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-sm font-medium capitalize">
                            {column.id
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())
                              .replace("Tl", "") // Remove "tl" from column names
                            }
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {isVisible ? "Visible" : "Hidden"}
                          </span>
                        </div>

                        <div
                          className={`h-2 w-2 rounded-full transition-colors ${
                            isVisible
                              ? "bg-green-400"
                              : "bg-gray-300 dark:bg-zinc-600"
                          }`}
                        />
                      </div>
                    );
                  })}
              </div>

              {/* Footer Stats */}
              <div className="px-2 pt-3 mt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>Visible columns</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {table.getVisibleFlatColumns().length} of{" "}
                    {table.getAllColumns().filter((col) => col.getCanHide()).length}
                  </span>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-gray-700"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-gray-700 dark:text-gray-300 py-4 px-4 text-left"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 px-4 text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center py-8">
                    <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                      {globalFilter ? "No results found" : "No courses available"}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      {globalFilter
                        ? "Try adjusting your search terms"
                        : "Get started by creating your first course"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {table.getFilteredRowModel().rows.length}
          </span>{" "}
          {table.getFilteredRowModel().rows.length === 1 ? "result" : "results"}
          {globalFilter && (
            <span className="ml-1">
              for "
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {globalFilter}
              </span>
              "
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors px-4"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors px-4"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}