// frontend/src/components/Pagination.js
import React from 'react';

const Pagination = ({ page, total, limit, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);
  return (
    <div>
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>Previous</button>
      {[...Array(totalPages)].map((_, i) => (
        <button key={i+1} onClick={() => onPageChange(i+1)}>{i+1}</button>
      ))}
      <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
    </div>
  );
};

export default Pagination;