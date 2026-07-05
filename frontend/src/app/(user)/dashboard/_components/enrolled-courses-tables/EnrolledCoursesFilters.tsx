import React from "react";
import { Search, Filter, Eye } from "lucide-react";
import { dmSans } from "@/lib/config/fonts";
import { VisibleColumns, Enrollment } from "./EnrolledCoursesTypes";

interface EnrolledCoursesFiltersProps {
  searchTerm: string;
  statusFilter: string;
  visibleColumns: VisibleColumns;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onToggleColumnVisibility: (column: keyof Enrollment) => void;
}

export const EnrolledCoursesFilters = ({
  searchTerm,
  statusFilter,
  visibleColumns,
  onSearchChange,
  onStatusFilterChange,
  onToggleColumnVisibility,
}: EnrolledCoursesFiltersProps) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Search and Status Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search courses or categories..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className={`${dmSans.className} appearance-none bg-card border border-border rounded-xl px-4 py-2.5 pr-10 text-foreground focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="PAUSED">Paused</option>
            <option value="DROPPED">Dropped</option>
          </select>
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Column Visibility Toggle */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Columns:
        </span>
        {Object.entries(visibleColumns).map(([column, isVisible]) => (
          <button
            key={column}
            onClick={() => onToggleColumnVisibility(column as keyof Enrollment)}
            className={`${dmSans.className} px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              isVisible
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {column.charAt(0).toUpperCase() +
              column.slice(1).replace(/([A-Z])/g, " $1")}
          </button>
        ))}
      </div>
    </div>
  );
};
