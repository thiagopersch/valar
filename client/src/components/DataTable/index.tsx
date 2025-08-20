'use client';

import Loading from '@/app/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { cn } from '@/lib/utils';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { FilterBox } from './_components/FilterBox';
import { TablePagination } from './_components/TablePagination';
import useTable from './_hook/useTable';
import { DynamicTableProps } from './_types/DynamicTableProps';
import { FilterField } from './_types/FilterField';

export function DataTable<TData, TValue>({
  columns,
  rows,
  isLoading = false,
  addAction,
  actions,
}: DynamicTableProps<TData, TValue>) {
  const {
    searchTerm,
    filters,
    openFilter,
    paginatedRows,
    page,
    rowsPerPage,
    totalPages,
    totalRows,
    setSearchTerm,
    setFilters,
    setOpenFilter,
    setPage,
    setRowsPerPage,
    goToPreviousPage,
    goToNextPage,
  } = useTable({ columns, rows });

  const table = useReactTable({
    data: paginatedRows ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const filterFields: FilterField[] = columns
    .filter((col) => (col as any).meta?.filterType)
    .map((col) => {
      const accessorKey = (col as any).accessorKey as string;
      const meta = (col as any).meta;
      const baseFilterField = {
        label: col.header?.toString() || '',
        controlName: accessorKey,
        type: meta.filterType as FilterField['type'],
        placeholder: `Filtrar por ${col.header}`,
      };

      if (meta.filterType === 'select') {
        return {
          ...baseFilterField,
          options: meta.data,
        };
      }

      if (meta.filterType === 'range' || meta.filterType === 'number') {
        return {
          ...baseFilterField,
          min: meta.min,
          max: meta.max,
          step: meta.step,
        };
      }

      return baseFilterField;
    });

  const handleApplyFilters = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  return (
    <div
      className={cn('mt-4 space-y-4 transition-all duration-300', {
        'backdrop-blur-2xl': openFilter,
      })}
    >
      <div className="flex flex-row items-center justify-between gap-2 space-y-4 max-md:flex-col">
        {addAction && (
          <Button variant="default" size="lg" onClick={addAction} className="max-md:w-full">
            Adicionar
          </Button>
        )}
        <Input
          placeholder="Digite para pesquisar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm flex-1"
        />
        <FilterBox
          fields={filterFields}
          filters={filters}
          setFilters={setFilters}
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          onApplyFilters={handleApplyFilters}
        />
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-hidden rounded border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Não há resultado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <TablePagination
        page={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        totalRows={totalRows}
      />
    </div>
  );
}
