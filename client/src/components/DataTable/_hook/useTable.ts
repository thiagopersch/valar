import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { DynamicTableProps } from '../_types/DynamicTableProps';

export default function useTable<TData, TValue>({ columns, rows }: DynamicTableProps<TData, TValue>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [openFilter, setOpenFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    handler();
    return () => handler.cancel();
  }, [searchTerm]);

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch = debouncedSearchTerm
        ? (columns as { accessorKey: string }[]).some((col) => {
            const value = getNestedValue(row, col.accessorKey)?.toString().toLowerCase();
            return value?.includes(debouncedSearchTerm.toLowerCase());
          })
        : true;

      const matchesFilters = Object.entries(filters).every(([key, filterValue]) => {
        if (filterValue === undefined || filterValue === null || filterValue === '') {
          return true;
        }

        const rowValue = getNestedValue(row, key);

        if (typeof rowValue === 'boolean' && typeof filterValue === 'boolean') {
          return rowValue === filterValue;
        } else if (typeof rowValue === 'string' && typeof filterValue === 'string') {
          return rowValue.toLowerCase().includes(filterValue.toLowerCase());
        }

        return false;
      });

      return matchesSearch && matchesFilters;
    });
  }, [rows, debouncedSearchTerm, filters, columns]);

  const totalRows = filteredRows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredRows.slice(start, end);
  }, [filteredRows, page, rowsPerPage]);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    } else if (page < 1) {
      setPage(1);
    }
  }, [page, totalPages]);

  const getUniqueValues = (accessorKey: string) => {
    const values = new Set(rows.map((row) => getNestedValue(row, accessorKey)?.toString()));
    return Array.from(values).filter(Boolean);
  };

  const goToFirstPage = () => setPage(1);
  const goToPreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const goToLastPage = () => setPage(totalPages);

  return {
    searchTerm,
    filteredRows,
    totalRows,
    totalPages,
    paginatedRows,
    filters,
    openFilter,
    page,
    rowsPerPage,
    setSearchTerm,
    setFilters,
    setOpenFilter,
    setPage,
    setRowsPerPage,
    getUniqueValues,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    getNestedValue,
  };
}
