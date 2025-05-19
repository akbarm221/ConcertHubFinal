import React from 'react';

const PaginationButton = ({ children, active = false, disabled = false }) => {
  const baseClasses = "px-3 py-1 border rounded transition duration-150 text-sm";
  const activeClasses = "bg-purple-600 text-white border-purple-600";
  const inactiveClasses = "bg-white text-purple-600 border-gray-300 hover:bg-purple-50";
  const disabledClasses = "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";

  let classes = `${baseClasses} `;
  if (disabled) {
    classes += disabledClasses;
  } else if (active) {
    classes += activeClasses;
  } else {
    classes += inactiveClasses;
  }

  return (
      <button className={classes} disabled={disabled}>{children}</button>
  )
}

const Pagination = () => {
  
  const currentPage = 1;
  const totalPages = 4; 

  return (
    <div className="flex justify-center items-center space-x-2 mt-8 mb-8 px-4">
        <PaginationButton disabled={currentPage === 1}>{'<'}</PaginationButton>
        <PaginationButton active={currentPage === 1}>1</PaginationButton>
        <PaginationButton active={currentPage === 2}>2</PaginationButton>
        <PaginationButton active={currentPage === 3}>3</PaginationButton>
        <span className="text-gray-500 hidden sm:inline">...</span>
        <PaginationButton active={currentPage === totalPages}>{totalPages}</PaginationButton>
        <PaginationButton disabled={currentPage === totalPages}>{'>'}</PaginationButton>
    </div>
  );
};

export default Pagination;