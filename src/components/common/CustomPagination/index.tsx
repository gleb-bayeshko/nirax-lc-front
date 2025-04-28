import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  currentPage: number;
  pages: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function CustomPagination({
  currentPage,
  pages,
  onPageChange,
}: CustomPaginationProps) {
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(pages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      visiblePages.push(1);
      if (start > 2) {
        visiblePages.push("ellipsis-left");
      }
    }

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    if (end < pages) {
      if (end < pages - 1) {
        visiblePages.push("ellipsis-right");
      }
      visiblePages.push(pages);
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
          />
        </PaginationItem>

        {/* Страницы */}
        {visiblePages.map((page, index) => {
          if (page === "ellipsis-left" || page === "ellipsis-right") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Number(page));
                }}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Кнопка "Вперед" */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < pages) onPageChange(currentPage + 1);
            }}
            aria-disabled={currentPage === pages}
            className={
              currentPage === pages ? "opacity-50 cursor-not-allowed" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
