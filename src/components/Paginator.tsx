import React from "react";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const maxVisibleButtons = 7;
  const halfVisibleButtons = Math.floor(maxVisibleButtons / 2);

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= halfVisibleButtons + 1) {
        for (let i = 1; i <= maxVisibleButtons - 2; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...", totalPages);
      } else if (currentPage >= totalPages - halfVisibleButtons) {
        pageNumbers.push(1, "...");
        for (let i = totalPages - maxVisibleButtons + 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1, "...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...", totalPages);
      }
    }

    return pageNumbers;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination">
      <button onClick={handlePrevious} disabled={currentPage === 1}>
        &lt;&lt;
      </button>
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === currentPage || page === "..."}
          className={page === currentPage ? "active" : ""}
        >
          {page}
        </button>
      ))}
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        &gt;&gt;
      </button>
    </div>
  );
};

export default Paginator;
