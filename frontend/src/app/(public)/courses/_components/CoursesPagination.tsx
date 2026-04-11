import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export const CoursesPagination = ({ currentPage, totalPages, onPageChange }: any) => {
    const handlePrevious = () => onPageChange(currentPage - 1);
    const handleNext = () => onPageChange(currentPage + 1);
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href=""
              // disabled={currentPage === 1}
              onClick={handlePrevious}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href=""
                  isActive={currentPage === pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href=""
            //   disabled={currentPage === totalPages}
              onClick={handleNext}
            ></PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };