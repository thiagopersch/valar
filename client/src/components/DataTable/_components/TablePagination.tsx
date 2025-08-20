import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface TablePaginationProps {
  page: number;
  totalPages: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  totalRows: number;
}

export function TablePagination({
  page,
  totalPages,
  rowsPerPage,
  setPage,
  setRowsPerPage,
  goToPreviousPage,
  goToNextPage,
  totalRows,
}: TablePaginationProps) {
  const pagesToShow = 10;
  const startPage = Math.max(1, page - Math.floor(pagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + pagesToShow - 1);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <div className="mt-4 flex items-center justify-between gap-3 max-sm:flex-col">
      <p className="text-muted-foreground flex-1 text-sm whitespace-nowrap">
        Página <span className="text-foreground">{page}</span> de{' '}
        <span className="text-foreground">{totalPages}</span> ({totalRows}{' '}
        resultados)
      </p>

      <div className="grow">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                onClick={goToPreviousPage}
                disabled={page === 1}
                aria-label="Página anterior"
              >
                <ChevronLeftIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>

            {startPage > 1 && (
              <PaginationItem>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setPage(1)}
                  aria-label="Primeira página"
                >
                  1
                </Button>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {pages.map((p) => (
              <PaginationItem key={p}>
                <Button
                  size="icon"
                  variant={p === page ? 'outline' : 'ghost'}
                  onClick={() => setPage(p)}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </Button>
              </PaginationItem>
            ))}

            {endPage < totalPages && (
              <PaginationItem>
                <PaginationEllipsis />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setPage(totalPages)}
                  aria-label="Última página"
                >
                  {totalPages}
                </Button>
              </PaginationItem>
            )}

            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                onClick={goToNextPage}
                disabled={page === totalPages}
                aria-label="Próxima página"
              >
                <ChevronRightIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div className="flex flex-1 justify-end">
        <Select
          value={rowsPerPage.toString()}
          onValueChange={(value) => setRowsPerPage(Number(value))}
          aria-label="Resultados por página"
        >
          <SelectTrigger className="w-fit whitespace-nowrap">
            <SelectValue placeholder="Resultados por página" />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} / página
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
