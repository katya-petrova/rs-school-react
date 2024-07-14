import React from 'react';
import './NavigationButtons.css';

const NavigationButtons: React.FC<{
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
}> = ({ currentPage, totalPages, nextPage, prevPage }) => {
  return (
    <div className="nav-buttons">
      <button disabled={currentPage === 0} onClick={prevPage}>
        Prev
      </button>
      <button disabled={currentPage === totalPages - 1} onClick={nextPage}>
        Next
      </button>
    </div>
  );
};

export default NavigationButtons;
