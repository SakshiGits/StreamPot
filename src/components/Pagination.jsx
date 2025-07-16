import React from 'react';

/**
 * Pagination component for navigating through pages of movie results.
 * @param {object} props - Component props.
 * @param {number} props.currentPage - The current active page number.
 * @param {number} props.totalPages - The total number of available pages.
 * @param {function(number): void} props.onPageChange - Callback function when a page button is clicked.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Do not render if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  // Determine the range of page numbers to display for a cleaner UI
  const maxButtons = 5; // Maximum number of page buttons to show at once
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  // Adjust startPage if we're at the end of the total pages
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      {/* Previous Button */}
      <button
        className="pagination-button px-6"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        Previous
      </button>

      {/* Numbered Page Buttons */}
      {pageNumbers.map(page => (
        <button
          key={page}
          className={`pagination-button ${page === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          aria-label={`Go to page ${page}`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        className="pagination-button px-6"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
